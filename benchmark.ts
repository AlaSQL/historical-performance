/**
 * AlaSQL Historical Performance Benchmark
 * 
 * This script benchmarks various AlaSQL versions across different SQL operations
 * ranging from simple to advanced queries.
 */

// Import all AlaSQL versions with aliases
import alasql0411 from 'alasql-0.4.11';
import alasql175 from 'alasql-1.7.5';
import alasql200 from 'alasql-2.0.0';
import alasql300 from 'alasql-3.0.0';
import alasql400 from 'alasql-4.0.0';
import alasql4101 from 'alasql-4.10.1';

// Type definitions
interface AlaSQLInstance {
  (query: string, params?: unknown[]): unknown;
}

interface VersionedAlaSQL {
  name: string;
  version: string;
  alasql: AlaSQLInstance;
}

interface BenchmarkResult {
  version: string;
  testName: string;
  duration: number;
  iterations: number;
  opsPerSecond: number;
}

interface TestCase {
  name: string;
  description: string;
  setup: (alasql: AlaSQLInstance) => void;
  run: (alasql: AlaSQLInstance) => unknown;
  teardown: (alasql: AlaSQLInstance) => void;
}

// All AlaSQL versions to benchmark
const versions: VersionedAlaSQL[] = [
  { name: 'alasql-0.4.11', version: '0.4.11', alasql: alasql0411 as AlaSQLInstance },
  { name: 'alasql-1.7.5', version: '1.7.5', alasql: alasql175 as AlaSQLInstance },
  { name: 'alasql-2.0.0', version: '2.0.0', alasql: alasql200 as AlaSQLInstance },
  { name: 'alasql-3.0.0', version: '3.0.0', alasql: alasql300 as AlaSQLInstance },
  { name: 'alasql-4.0.0', version: '4.0.0', alasql: alasql400 as AlaSQLInstance },
  { name: 'alasql-4.10.1', version: '4.10.1', alasql: alasql4101 as AlaSQLInstance },
];

// Helper function to generate test data
function generateUsers(count: number): Array<{ id: number; name: string; age: number; department: string; salary: number }> {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
    age: 22 + (i % 43),
    department: departments[i % departments.length],
    salary: 30000 + (i * 500) % 70000,
  }));
}

function generateOrders(count: number, maxUserId: number): Array<{ id: number; userId: number; product: string; amount: number; date: string }> {
  const products = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Camera'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: (i % maxUserId) + 1,
    product: products[i % products.length],
    amount: 10 + (i * 7) % 990,
    date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
}

// Test Cases (Simple to Advanced)
const testCases: TestCase[] = [
  // Test 1: Simple SELECT on small dataset
  {
    name: 'Simple SELECT (100 rows)',
    description: 'Basic SELECT * query on a small dataset of 100 rows',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT)');
      const users = generateUsers(100);
      alasql('DELETE FROM users');
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?)', [u.id, u.name, u.age]));
    },
    run: (alasql) => {
      return alasql('SELECT * FROM users');
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
    },
  },

  // Test 2: SELECT with WHERE clause filtering
  {
    name: 'WHERE Filtering (1000 rows)',
    description: 'SELECT with WHERE clause filtering on a dataset of 1000 rows',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING)');
      const users = generateUsers(1000);
      alasql('DELETE FROM users');
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?, ?)', [u.id, u.name, u.age, u.department]));
    },
    run: (alasql) => {
      return alasql('SELECT * FROM users WHERE age > 30 AND department = ?', ['Engineering']);
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
    },
  },

  // Test 3: JOIN operation
  {
    name: 'JOIN Operation (1000 users, 5000 orders)',
    description: 'INNER JOIN between users and orders tables',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)');
      alasql('CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)');
      
      const users = generateUsers(1000);
      const orders = generateOrders(5000, 1000);
      
      alasql('DELETE FROM users');
      alasql('DELETE FROM orders');
      
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?, ?, ?)', [u.id, u.name, u.age, u.department, u.salary]));
      orders.forEach(o => alasql('INSERT INTO orders VALUES (?, ?, ?, ?, ?)', [o.id, o.userId, o.product, o.amount, o.date]));
    },
    run: (alasql) => {
      return alasql('SELECT u.name, o.product, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId WHERE o.amount > 500');
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
      alasql('DROP TABLE IF EXISTS orders');
    },
  },

  // Test 4: GROUP BY with aggregations
  {
    name: 'GROUP BY with Aggregations',
    description: 'GROUP BY with COUNT, SUM, and AVG aggregations',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)');
      
      const users = generateUsers(5000);
      alasql('DELETE FROM users');
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?, ?, ?)', [u.id, u.name, u.age, u.department, u.salary]));
    },
    run: (alasql) => {
      return alasql('SELECT department, COUNT(*) as cnt, SUM(salary) as totalSalary, AVG(age) as avgAge FROM users GROUP BY department');
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
    },
  },

  // Test 5: Subqueries
  {
    name: 'Subquery Operation',
    description: 'SELECT with subquery for filtering',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)');
      alasql('CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)');
      
      const users = generateUsers(1000);
      const orders = generateOrders(3000, 1000);
      
      alasql('DELETE FROM users');
      alasql('DELETE FROM orders');
      
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?, ?, ?)', [u.id, u.name, u.age, u.department, u.salary]));
      orders.forEach(o => alasql('INSERT INTO orders VALUES (?, ?, ?, ?, ?)', [o.id, o.userId, o.product, o.amount, o.date]));
    },
    run: (alasql) => {
      return alasql('SELECT * FROM users WHERE id IN (SELECT userId FROM orders WHERE amount > 800)');
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
      alasql('DROP TABLE IF EXISTS orders');
    },
  },

  // Test 6: Complex query with ORDER BY, LIMIT
  {
    name: 'Complex Query (ORDER BY, LIMIT)',
    description: 'Complex aggregation with ORDER BY and LIMIT on large dataset',
    setup: (alasql) => {
      alasql('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)');
      alasql('CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)');
      
      const users = generateUsers(2000);
      const orders = generateOrders(10000, 2000);
      
      alasql('DELETE FROM users');
      alasql('DELETE FROM orders');
      
      users.forEach(u => alasql('INSERT INTO users VALUES (?, ?, ?, ?, ?)', [u.id, u.name, u.age, u.department, u.salary]));
      orders.forEach(o => alasql('INSERT INTO orders VALUES (?, ?, ?, ?, ?)', [o.id, o.userId, o.product, o.amount, o.date]));
    },
    run: (alasql) => {
      return alasql(`
        SELECT u.department, u.name, COUNT(o.id) as orderCount, SUM(o.amount) as totalAmount
        FROM users u
        INNER JOIN orders o ON u.id = o.userId
        WHERE u.salary > 40000
        GROUP BY u.department, u.name
        ORDER BY totalAmount DESC
        LIMIT 20
      `);
    },
    teardown: (alasql) => {
      alasql('DROP TABLE IF EXISTS users');
      alasql('DROP TABLE IF EXISTS orders');
    },
  },
];

// Benchmark function
function runBenchmark(alasql: AlaSQLInstance, testCase: TestCase, iterations: number): { duration: number; iterations: number } {
  // Setup
  testCase.setup(alasql);
  
  // Warm-up run
  testCase.run(alasql);
  
  // Timed runs
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    testCase.run(alasql);
  }
  const end = performance.now();
  
  // Teardown
  testCase.teardown(alasql);
  
  return {
    duration: end - start,
    iterations,
  };
}

// Format duration for display
function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Format ops per second
function formatOps(ops: number): string {
  if (ops >= 1000000) return `${(ops / 1000000).toFixed(2)}M`;
  if (ops >= 1000) return `${(ops / 1000).toFixed(2)}K`;
  return ops.toFixed(2);
}

// Main benchmark runner
async function main() {
  const isQuickMode = process.argv.includes('--quick');
  const iterations = isQuickMode ? 10 : 50;
  
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           AlaSQL Historical Performance Benchmark                            ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  Mode: ${isQuickMode ? 'Quick' : 'Full'}                                                                       ║`);
  console.log(`║  Iterations per test: ${iterations}                                                        ║`);
  console.log(`║  Versions: ${versions.map(v => v.version).join(', ')}                     ║`);
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log('');
  
  const allResults: BenchmarkResult[] = [];
  
  for (const testCase of testCases) {
    console.log(`\n${'━'.repeat(80)}`);
    console.log(`📊 Test: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    console.log(`${'━'.repeat(80)}`);
    
    const testResults: BenchmarkResult[] = [];
    
    for (const { name, version, alasql } of versions) {
      try {
        const result = runBenchmark(alasql, testCase, iterations);
        const opsPerSecond = (result.iterations / result.duration) * 1000;
        
        const benchmarkResult: BenchmarkResult = {
          version,
          testName: testCase.name,
          duration: result.duration,
          iterations: result.iterations,
          opsPerSecond,
        };
        
        testResults.push(benchmarkResult);
        allResults.push(benchmarkResult);
        
        console.log(`   ✅ v${version.padEnd(8)} │ ${formatDuration(result.duration).padStart(10)} │ ${formatOps(opsPerSecond).padStart(10)} ops/s`);
      } catch (error) {
        console.log(`   ❌ v${version.padEnd(8)} │ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Find best performer for this test
    if (testResults.length > 0) {
      const best = testResults.reduce((a, b) => a.opsPerSecond > b.opsPerSecond ? a : b);
      console.log(`   🏆 Best: v${best.version} (${formatOps(best.opsPerSecond)} ops/s)`);
    }
  }
  
  // Summary table
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log('📈 SUMMARY - Average Operations per Second by Version');
  console.log(`${'═'.repeat(80)}`);
  
  // Calculate averages per version
  const versionAverages = versions.map(v => {
    const versionResults = allResults.filter(r => r.version === v.version);
    const avgOps = versionResults.reduce((sum, r) => sum + r.opsPerSecond, 0) / versionResults.length;
    return { version: v.version, avgOps };
  });
  
  // Sort by average ops
  versionAverages.sort((a, b) => b.avgOps - a.avgOps);
  
  console.log('\n   Rank │ Version   │ Avg Ops/s');
  console.log('   ─────┼───────────┼──────────────');
  versionAverages.forEach((v, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`   ${medal} ${(i + 1).toString().padStart(2)} │ v${v.version.padEnd(8)} │ ${formatOps(v.avgOps).padStart(10)} ops/s`);
  });
  
  // Detailed results table
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log('📋 DETAILED RESULTS');
  console.log(`${'═'.repeat(80)}\n`);
  
  // Create a matrix view
  const header = ['Test Case', ...versions.map(v => `v${v.version}`)];
  console.log('   ' + header.map(h => h.padEnd(15)).join('│ '));
  console.log('   ' + header.map(() => '─'.repeat(15)).join('┼─'));
  
  for (const testCase of testCases) {
    const row = [testCase.name.substring(0, 14)];
    for (const v of versions) {
      const result = allResults.find(r => r.version === v.version && r.testName === testCase.name);
      row.push(result ? `${formatOps(result.opsPerSecond)} ops/s` : 'N/A');
    }
    console.log('   ' + row.map(c => c.padEnd(15)).join('│ '));
  }
  
  console.log(`\n${'═'.repeat(80)}`);
  console.log('✅ Benchmark complete!');
  console.log(`${'═'.repeat(80)}\n`);
}

main().catch(console.error);
