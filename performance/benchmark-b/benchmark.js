/**
 * AlaSQL Historical Performance Benchmark (Benchmark B)
 *
 * Simpler benchmark output format with per-test grouping.
 * Run with: yarn bench-b
 */

import { versions, loadAlasqlNext } from "./versions.js";
import { generateUsers, generateOrders } from "./data-generators.js";

// Load all versions including NEXT
const allVersions = [...versions];
const nextVersion = await loadAlasqlNext();
if (nextVersion) {
  allVersions.push(nextVersion);
  console.log(`✅ Loaded AlaSQL NEXT (${nextVersion.version})\n`);
} else {
  console.log("⚠️ AlaSQL NEXT not available. Run ./build-next.sh first.\n");
}

// Pre-generate test data
const users100 = generateUsers(100);
const users1000 = generateUsers(1000);
const users2000 = generateUsers(2000);
const users5000 = generateUsers(5000);
const orders3000 = generateOrders(3000, 1000);
const orders5000 = generateOrders(5000, 1000);
const orders10000 = generateOrders(10000, 2000);

/**
 * Run a benchmark for a specific function
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {{totalMs: number, opsPerSec: number}}
 */
function benchmark(fn, iterations = 100) {
  // Warm up
  fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const totalMs = performance.now() - start;
  const opsPerSec = (iterations / totalMs) * 1000;

  return { totalMs, opsPerSec };
}

/**
 * Format ops/s for display
 * @param {number} ops
 * @returns {string}
 */
function formatOps(ops) {
  if (ops >= 1000000) return `${(ops / 1000000).toFixed(2)}M ops/s`;
  if (ops >= 1000) return `${(ops / 1000).toFixed(2)}K ops/s`;
  return `${ops.toFixed(2)} ops/s`;
}

/**
 * Run a test group
 * @param {string} name - Test name
 * @param {Function} setupFn - Setup function that takes alasql
 * @param {Function} testFn - Test function that takes alasql
 * @param {number} iterations - Number of iterations
 */
function group(name, setupFn, testFn, iterations = 100) {
  console.log(`\n┌${"─".repeat(78)}┐`);
  console.log(`│ ${name.padEnd(76)} │`);
  console.log(`├${"─".repeat(78)}┤`);

  const results = [];

  // Run benchmark for each version
  for (const v of allVersions) {
    setupFn(v.alasql);
    const result = benchmark(() => testFn(v.alasql), iterations);
    results.push({ version: v.version, ...result });

    // Cleanup
    v.alasql("DROP TABLE IF EXISTS users");
    v.alasql("DROP TABLE IF EXISTS orders");
  }

  // Sort by ops/sec
  results.sort((a, b) => b.opsPerSec - a.opsPerSec);
  const baseline = results[results.length - 1].opsPerSec; // slowest as baseline

  // Print results
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const speedup = (r.opsPerSec / baseline).toFixed(2);
    const bar = "█".repeat(Math.min(Math.round(r.opsPerSec / baseline * 10), 40));
    const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
    console.log(
      `│ ${rank} v${r.version.padEnd(15)} │ ${formatOps(r.opsPerSec).padStart(15)} │ ${speedup.padStart(5)}x │ ${bar}`
    );
  }

  console.log(`└${"─".repeat(78)}┘`);
}

// Test 1: Simple SELECT (100 rows)
group(
  "Test 1: Simple SELECT (100 rows)",
  (alasql) => {
    alasql("CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT)");
    alasql("DELETE FROM users");
    users100.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?)", [u.id, u.name, u.age])
    );
  },
  (alasql) => alasql("SELECT * FROM users"),
  100
);

// Test 2: WHERE Filtering (1000 rows)
group(
  "Test 2: WHERE Filtering (1000 rows)",
  (alasql) => {
    alasql(
      "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING)"
    );
    alasql("DELETE FROM users");
    users1000.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?, ?)", [
        u.id,
        u.name,
        u.age,
        u.department,
      ])
    );
  },
  (alasql) =>
    alasql("SELECT * FROM users WHERE age > 30 AND department = ?", [
      "Engineering",
    ]),
  100
);

// Test 3: JOIN Operation (1000 users, 5000 orders)
group(
  "Test 3: JOIN Operation (1000 users, 5000 orders)",
  (alasql) => {
    alasql(
      "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
    );
    alasql(
      "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
    );
    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    users1000.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
        u.id,
        u.name,
        u.age,
        u.department,
        u.salary,
      ])
    );
    orders5000.forEach((o) =>
      alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
        o.id,
        o.userId,
        o.product,
        o.amount,
        o.date,
      ])
    );
  },
  (alasql) =>
    alasql(
      "SELECT u.name, o.product, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId WHERE o.amount > 500"
    ),
  50
);

// Test 4: GROUP BY with Aggregations
group(
  "Test 4: GROUP BY with Aggregations",
  (alasql) => {
    alasql(
      "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
    );
    alasql("DELETE FROM users");
    users5000.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
        u.id,
        u.name,
        u.age,
        u.department,
        u.salary,
      ])
    );
  },
  (alasql) =>
    alasql(
      "SELECT department, COUNT(*) as cnt, SUM(salary) as totalSalary, AVG(age) as avgAge FROM users GROUP BY department"
    ),
  50
);

// Test 5: Subquery Operation
group(
  "Test 5: Subquery Operation",
  (alasql) => {
    alasql(
      "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
    );
    alasql(
      "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
    );
    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    users1000.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
        u.id,
        u.name,
        u.age,
        u.department,
        u.salary,
      ])
    );
    orders3000.forEach((o) =>
      alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
        o.id,
        o.userId,
        o.product,
        o.amount,
        o.date,
      ])
    );
  },
  (alasql) =>
    alasql(
      "SELECT 1 -- * FROM users WHERE id IN (SELECT userId FROM orders WHERE amount > 800)"
    ),
  50
);

// Test 6: Complex Query (ORDER BY, LIMIT)
group(
  "Test 6: Complex Query (ORDER BY, LIMIT)",
  (alasql) => {
    alasql(
      "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
    );
    alasql(
      "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
    );
    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    users2000.forEach((u) =>
      alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
        u.id,
        u.name,
        u.age,
        u.department,
        u.salary,
      ])
    );
    orders10000.forEach((o) =>
      alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
        o.id,
        o.userId,
        o.product,
        o.amount,
        o.date,
      ])
    );
  },
  (alasql) =>
    alasql(`
      SELECT u.department, u.name, COUNT(o.id) as orderCount, SUM(o.amount) as totalAmount
      FROM users u
      INNER JOIN orders o ON u.id = o.userId
      WHERE u.salary > 40000
      GROUP BY u.department, u.name
      ORDER BY totalAmount DESC
      LIMIT 20
    `),
  50
);

console.log("\n✅ Benchmark B complete!\n");
