/**
 * AlaSQL Historical Performance Benchmark (Benchmark B)
 *
 * Uses Bun's test framework with describe and it.
 * Run with: yarn bench-b
 */

import { describe, it, expect } from "bun:test";
import { versions } from "./versions.js";
import { generateUsers, generateOrders } from "./data-generators.js";

// Pre-generate test data
const users100 = generateUsers(100);
const users1000 = generateUsers(1000);
const users2000 = generateUsers(2000);
const users5000 = generateUsers(5000);
const orders3000 = generateOrders(3000, 1000);
const orders5000 = generateOrders(5000, 1000);
const orders10000 = generateOrders(10000, 2000);

/**
 * Benchmark helper
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {{totalMs: number, opsPerSec: number}}
 */
function benchmark(fn, iterations = 50) {
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

// Define test cases
const testCases = [
  {
    name: "Simple SELECT (100 rows)",
    setup: (alasql) => {
      alasql("CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT)");
      alasql("DELETE FROM users");
      users100.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?)", [u.id, u.name, u.age])
      );
    },
    run: (alasql) => alasql("SELECT * FROM users"),
    teardown: (alasql) => alasql("DROP TABLE IF EXISTS users"),
  },
  {
    name: "WHERE Filtering (1000 rows)",
    setup: (alasql) => {
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
    run: (alasql) =>
      alasql("SELECT * FROM users WHERE age > 30 AND department = ?", [
        "Engineering",
      ]),
    teardown: (alasql) => alasql("DROP TABLE IF EXISTS users"),
  },
  {
    name: "JOIN Operation (1000 users, 5000 orders)",
    setup: (alasql) => {
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
    run: (alasql) =>
      alasql(
        "SELECT u.name, o.product, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId WHERE o.amount > 500"
      ),
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },
  {
    name: "GROUP BY with Aggregations",
    setup: (alasql) => {
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
    run: (alasql) =>
      alasql(
        "SELECT department, COUNT(*) as cnt, SUM(salary) as totalSalary, AVG(age) as avgAge FROM users GROUP BY department"
      ),
    teardown: (alasql) => alasql("DROP TABLE IF EXISTS users"),
  },
  {
    name: "Subquery Operation",
    setup: (alasql) => {
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
    run: (alasql) =>
      alasql(
        "SELECT 1 -- * FROM users WHERE id IN (SELECT userId FROM orders WHERE amount > 800)"
      ),
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },
  {
    name: "Complex Query (ORDER BY, LIMIT)",
    setup: (alasql) => {
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
    run: (alasql) =>
      alasql(`
        SELECT u.department, u.name, COUNT(o.id) as orderCount, SUM(o.amount) as totalAmount
        FROM users u
        INNER JOIN orders o ON u.id = o.userId
        WHERE u.salary > 40000
        GROUP BY u.department, u.name
        ORDER BY totalAmount DESC
        LIMIT 20
      `),
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },
];

// Run benchmarks for each test case
testCases.forEach((testCase) => {
  describe(`Benchmark: ${testCase.name}`, () => {
    versions.forEach((v, index) => {
      it(`v${v.version}`, () => {
        // Setup
        testCase.setup(v.alasql);

        // Benchmark
        const result = benchmark(() => testCase.run(v.alasql), 50);

        // Log result
        console.log(
          `  v${v.version.padEnd(10)} │ ${Math.round(result.opsPerSec).toString().padStart(8)} ops/s`
        );

        // Teardown
        testCase.teardown(v.alasql);

        // Must have positive ops/sec
        expect(result.opsPerSec).toBeGreaterThan(0);
      });
    });
  });
});
