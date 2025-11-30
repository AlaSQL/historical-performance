/**
 * AlaSQL Historical Performance Benchmark
 * 
 * This script benchmarks various AlaSQL versions across different SQL operations
 * ranging from simple to advanced queries.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Import all AlaSQL versions with aliases
import alasql0310 from 'alasql-0.3.10';
import alasql0412 from 'alasql-0.4.12';
import alasql0510 from 'alasql-0.5.10';
import alasql067 from 'alasql-0.6.7';
import alasql071 from 'alasql-0.7.1';
import alasql174 from 'alasql-1.7.4';
import alasql175 from 'alasql-1.7.5';
import alasql214 from 'alasql-2.1.4';
import alasql216 from 'alasql-2.1.6';
import alasql217 from 'alasql-2.1.7';
import alasql218 from 'alasql-2.1.8';
import alasql221 from 'alasql-2.2.1';
import alasql225 from 'alasql-2.2.5';
import alasql230 from 'alasql-2.3.0';
import alasql250 from 'alasql-2.5.0';
import alasql251 from 'alasql-2.5.1';
import alasql253 from 'alasql-2.5.3';
import alasql254 from 'alasql-2.5.4';
import alasql300 from 'alasql-3.0.0';
import alasql310 from 'alasql-3.1.0';
import alasql311 from 'alasql-3.1.1';
import alasql400 from 'alasql-4.0.0';
import alasql402 from 'alasql-4.0.2';
import alasql404 from 'alasql-4.0.4';
import alasql405 from 'alasql-4.0.5';
import alasql406 from 'alasql-4.0.6';
import alasql410 from 'alasql-4.1.0';
import alasql411 from 'alasql-4.1.1';
import alasql412 from 'alasql-4.1.2';
import alasql413 from 'alasql-4.1.3';
import alasql414 from 'alasql-4.1.4';
import alasql415 from 'alasql-4.1.5';
import alasql417 from 'alasql-4.1.7';
import alasql418 from 'alasql-4.1.8';
import alasql419 from 'alasql-4.1.9';
import alasql4110 from 'alasql-4.1.10';
import alasql4111 from 'alasql-4.1.11';
import alasql421 from 'alasql-4.2.1';
import alasql422 from 'alasql-4.2.2';
import alasql423 from 'alasql-4.2.3';
import alasql424 from 'alasql-4.2.4';
import alasql425 from 'alasql-4.2.5';
import alasql426 from 'alasql-4.2.6';
import alasql427 from 'alasql-4.2.7';
import alasql430 from 'alasql-4.3.0';
import alasql431 from 'alasql-4.3.1';
import alasql432 from 'alasql-4.3.2';
import alasql433 from 'alasql-4.3.3';
import alasql440 from 'alasql-4.4.0';
import alasql450 from 'alasql-4.5.0';
import alasql451 from 'alasql-4.5.1';
import alasql452 from 'alasql-4.5.2';
import alasql460 from 'alasql-4.6.0';
import alasql461 from 'alasql-4.6.1';
import alasql462 from 'alasql-4.6.2';
import alasql463 from 'alasql-4.6.3';
import alasql464 from 'alasql-4.6.4';
import alasql465 from 'alasql-4.6.5';
import alasql466 from 'alasql-4.6.6';
import alasql470 from 'alasql-4.7.0';
import alasql480 from 'alasql-4.8.0';
import alasql490 from 'alasql-4.9.0';
import alasql4100 from 'alasql-4.10.0';
import alasql4101 from 'alasql-4.10.1';

// Configuration constants
const COLUMN_WIDTH = 15;
const MEDALS = ['🥇', '🥈', '🥉'];

function getMedal(rank: number): string {
  return rank < MEDALS.length ? MEDALS[rank] : '  ';
}
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

// All AlaSQL versions to benchmark (sorted by semver)
const versions: VersionedAlaSQL[] = [
  { name: 'alasql-0.3.10', version: '0.3.10', alasql: alasql0310 as AlaSQLInstance },
  { name: 'alasql-0.4.12', version: '0.4.12', alasql: alasql0412 as AlaSQLInstance },
  { name: 'alasql-0.5.10', version: '0.5.10', alasql: alasql0510 as AlaSQLInstance },
  { name: 'alasql-0.6.7', version: '0.6.7', alasql: alasql067 as AlaSQLInstance },
  { name: 'alasql-0.7.1', version: '0.7.1', alasql: alasql071 as AlaSQLInstance },
  { name: 'alasql-1.7.4', version: '1.7.4', alasql: alasql174 as AlaSQLInstance },
  { name: 'alasql-1.7.5', version: '1.7.5', alasql: alasql175 as AlaSQLInstance },
  { name: 'alasql-2.1.4', version: '2.1.4', alasql: alasql214 as AlaSQLInstance },
  { name: 'alasql-2.1.6', version: '2.1.6', alasql: alasql216 as AlaSQLInstance },
  { name: 'alasql-2.1.7', version: '2.1.7', alasql: alasql217 as AlaSQLInstance },
  { name: 'alasql-2.1.8', version: '2.1.8', alasql: alasql218 as AlaSQLInstance },
  { name: 'alasql-2.2.1', version: '2.2.1', alasql: alasql221 as AlaSQLInstance },
  { name: 'alasql-2.2.5', version: '2.2.5', alasql: alasql225 as AlaSQLInstance },
  { name: 'alasql-2.3.0', version: '2.3.0', alasql: alasql230 as AlaSQLInstance },
  { name: 'alasql-2.5.0', version: '2.5.0', alasql: alasql250 as AlaSQLInstance },
  { name: 'alasql-2.5.1', version: '2.5.1', alasql: alasql251 as AlaSQLInstance },
  { name: 'alasql-2.5.3', version: '2.5.3', alasql: alasql253 as AlaSQLInstance },
  { name: 'alasql-2.5.4', version: '2.5.4', alasql: alasql254 as AlaSQLInstance },
  { name: 'alasql-3.0.0', version: '3.0.0', alasql: alasql300 as AlaSQLInstance },
  { name: 'alasql-3.1.0', version: '3.1.0', alasql: alasql310 as AlaSQLInstance },
  { name: 'alasql-3.1.1', version: '3.1.1', alasql: alasql311 as AlaSQLInstance },
  { name: 'alasql-4.0.0', version: '4.0.0', alasql: alasql400 as AlaSQLInstance },
  { name: 'alasql-4.0.2', version: '4.0.2', alasql: alasql402 as AlaSQLInstance },
  { name: 'alasql-4.0.4', version: '4.0.4', alasql: alasql404 as AlaSQLInstance },
  { name: 'alasql-4.0.5', version: '4.0.5', alasql: alasql405 as AlaSQLInstance },
  { name: 'alasql-4.0.6', version: '4.0.6', alasql: alasql406 as AlaSQLInstance },
  { name: 'alasql-4.1.0', version: '4.1.0', alasql: alasql410 as AlaSQLInstance },
  { name: 'alasql-4.1.1', version: '4.1.1', alasql: alasql411 as AlaSQLInstance },
  { name: 'alasql-4.1.2', version: '4.1.2', alasql: alasql412 as AlaSQLInstance },
  { name: 'alasql-4.1.3', version: '4.1.3', alasql: alasql413 as AlaSQLInstance },
  { name: 'alasql-4.1.4', version: '4.1.4', alasql: alasql414 as AlaSQLInstance },
  { name: 'alasql-4.1.5', version: '4.1.5', alasql: alasql415 as AlaSQLInstance },
  { name: 'alasql-4.1.7', version: '4.1.7', alasql: alasql417 as AlaSQLInstance },
  { name: 'alasql-4.1.8', version: '4.1.8', alasql: alasql418 as AlaSQLInstance },
  { name: 'alasql-4.1.9', version: '4.1.9', alasql: alasql419 as AlaSQLInstance },
  { name: 'alasql-4.1.10', version: '4.1.10', alasql: alasql4110 as AlaSQLInstance },
  { name: 'alasql-4.1.11', version: '4.1.11', alasql: alasql4111 as AlaSQLInstance },
  { name: 'alasql-4.2.1', version: '4.2.1', alasql: alasql421 as AlaSQLInstance },
  { name: 'alasql-4.2.2', version: '4.2.2', alasql: alasql422 as AlaSQLInstance },
  { name: 'alasql-4.2.3', version: '4.2.3', alasql: alasql423 as AlaSQLInstance },
  { name: 'alasql-4.2.4', version: '4.2.4', alasql: alasql424 as AlaSQLInstance },
  { name: 'alasql-4.2.5', version: '4.2.5', alasql: alasql425 as AlaSQLInstance },
  { name: 'alasql-4.2.6', version: '4.2.6', alasql: alasql426 as AlaSQLInstance },
  { name: 'alasql-4.2.7', version: '4.2.7', alasql: alasql427 as AlaSQLInstance },
  { name: 'alasql-4.3.0', version: '4.3.0', alasql: alasql430 as AlaSQLInstance },
  { name: 'alasql-4.3.1', version: '4.3.1', alasql: alasql431 as AlaSQLInstance },
  { name: 'alasql-4.3.2', version: '4.3.2', alasql: alasql432 as AlaSQLInstance },
  { name: 'alasql-4.3.3', version: '4.3.3', alasql: alasql433 as AlaSQLInstance },
  { name: 'alasql-4.4.0', version: '4.4.0', alasql: alasql440 as AlaSQLInstance },
  { name: 'alasql-4.5.0', version: '4.5.0', alasql: alasql450 as AlaSQLInstance },
  { name: 'alasql-4.5.1', version: '4.5.1', alasql: alasql451 as AlaSQLInstance },
  { name: 'alasql-4.5.2', version: '4.5.2', alasql: alasql452 as AlaSQLInstance },
  { name: 'alasql-4.6.0', version: '4.6.0', alasql: alasql460 as AlaSQLInstance },
  { name: 'alasql-4.6.1', version: '4.6.1', alasql: alasql461 as AlaSQLInstance },
  { name: 'alasql-4.6.2', version: '4.6.2', alasql: alasql462 as AlaSQLInstance },
  { name: 'alasql-4.6.3', version: '4.6.3', alasql: alasql463 as AlaSQLInstance },
  { name: 'alasql-4.6.4', version: '4.6.4', alasql: alasql464 as AlaSQLInstance },
  { name: 'alasql-4.6.5', version: '4.6.5', alasql: alasql465 as AlaSQLInstance },
  { name: 'alasql-4.6.6', version: '4.6.6', alasql: alasql466 as AlaSQLInstance },
  { name: 'alasql-4.7.0', version: '4.7.0', alasql: alasql470 as AlaSQLInstance },
  { name: 'alasql-4.8.0', version: '4.8.0', alasql: alasql480 as AlaSQLInstance },
  { name: 'alasql-4.9.0', version: '4.9.0', alasql: alasql490 as AlaSQLInstance },
  { name: 'alasql-4.10.0', version: '4.10.0', alasql: alasql4100 as AlaSQLInstance },
  { name: 'alasql-4.10.1', version: '4.10.1', alasql: alasql4101 as AlaSQLInstance },
];

// Bleeding-edge AlaSQL support
const ALASQL_REPO_URL = 'https://github.com/AlaSQL/alasql.git';
const BLEEDING_EDGE_DIR = path.join(process.cwd(), '.alasql-bleeding-edge');

async function loadBleedingEdgeAlaSQL(): Promise<VersionedAlaSQL | null> {
  try {
    console.log('🔧 Building bleeding-edge AlaSQL from GitHub...');
    
    // Clone or update the repository
    if (fs.existsSync(BLEEDING_EDGE_DIR)) {
      console.log('   Updating existing clone...');
      // Reset to origin/develop - this is an auto-managed directory
      execSync('git fetch origin && git reset --hard origin/develop', {
        cwd: BLEEDING_EDGE_DIR,
        stdio: 'pipe',
      });
    } else {
      console.log('   Cloning repository...');
      execSync(`git clone --depth 1 --branch develop ${ALASQL_REPO_URL} ${BLEEDING_EDGE_DIR}`, {
        stdio: 'pipe',
      });
    }
    
    // Install dependencies and build
    console.log('   Installing dependencies...');
    execSync('npm install', {
      cwd: BLEEDING_EDGE_DIR,
      stdio: 'pipe',
    });
    
    // Determine which build command to use
    // build-only skips formatting checks, but may not exist in older versions
    const packageJsonPath = path.join(BLEEDING_EDGE_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const buildCommand = packageJson.scripts?.['build-only'] ? 'npm run build-only' : 'npm run build';
    
    console.log('   Building...');
    execSync(buildCommand, {
      cwd: BLEEDING_EDGE_DIR,
      stdio: 'pipe',
    });
    
    // Get the commit hash for version identification
    const commitHash = execSync('git rev-parse --short HEAD', {
      cwd: BLEEDING_EDGE_DIR,
      encoding: 'utf-8',
    }).trim();
    
    // Load the built module
    // Note: This imports code from the official AlaSQL repository that was
    // cloned and built locally. The user explicitly opts in with --bleeding-edge.
    const distPath = path.join(BLEEDING_EDGE_DIR, 'dist', 'alasql.js');
    if (!fs.existsSync(distPath)) {
      throw new Error(`Built file not found at ${distPath}`);
    }
    
    const bleedingEdgeModule = await import(distPath);
    const alasql = bleedingEdgeModule.default || bleedingEdgeModule;
    
    console.log(`   ✅ Bleeding-edge build complete (commit: ${commitHash})`);
    
    return {
      name: 'alasql-bleeding-edge',
      version: `bleeding-edge (${commitHash})`,
      alasql: alasql as AlaSQLInstance,
    };
  } catch (error) {
    console.error(`   ❌ Failed to build bleeding-edge AlaSQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

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
  const currentYear = new Date().getFullYear();
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: (i % maxUserId) + 1,
    product: products[i % products.length],
    amount: 10 + (i * 7) % 990,
    date: `${currentYear}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
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

// Parse cycles from command line
function parseCycles(): number {
  const cyclesIndex = process.argv.findIndex(arg => arg === '--cycles');
  if (cyclesIndex !== -1 && process.argv[cyclesIndex + 1]) {
    const cycles = parseInt(process.argv[cyclesIndex + 1], 10);
    if (!isNaN(cycles) && cycles > 0) {
      return cycles;
    }
  }
  return 50; // Default to 50 cycles
}

// Main benchmark runner
async function main() {
  const iterations = parseCycles();
  const includeBleedingEdge = process.argv.includes('--bleeding-edge');
  
  // Build list of versions to benchmark
  const versionsToRun: VersionedAlaSQL[] = [...versions];
  
  // Add bleeding-edge version if requested
  if (includeBleedingEdge) {
    const bleedingEdge = await loadBleedingEdgeAlaSQL();
    if (bleedingEdge) {
      versionsToRun.push(bleedingEdge);
    }
  }
  
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           AlaSQL Historical Performance Benchmark                            ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  Cycles per test: ${iterations}                                                        ║`);
  console.log(`║  Versions: ${versionsToRun.map(v => v.version).join(', ')}                     ║`);
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log('');
  
  const allResults: BenchmarkResult[] = [];
  
  for (const testCase of testCases) {
    console.log(`\n${'━'.repeat(80)}`);
    console.log(`📊 Test: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    console.log(`${'━'.repeat(80)}`);
    
    const testResults: BenchmarkResult[] = [];
    
    for (const { name, version, alasql } of versionsToRun) {
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
  const versionAverages = versionsToRun.map(v => {
    const versionResults = allResults.filter(r => r.version === v.version);
    const avgOps = versionResults.reduce((sum, r) => sum + r.opsPerSecond, 0) / versionResults.length;
    return { version: v.version, avgOps };
  });
  
  // Sort by average ops
  versionAverages.sort((a, b) => b.avgOps - a.avgOps);
  
  console.log('\n   Rank │ Version   │ Avg Ops/s');
  console.log('   ─────┼───────────┼──────────────');
  versionAverages.forEach((v, i) => {
    const medal = getMedal(i);
    console.log(`   ${medal} ${(i + 1).toString().padStart(2)} │ v${v.version.padEnd(8)} │ ${Math.round(v.avgOps).toString().padStart(10)}`);
  });
  
  // Detailed results table - markdown format with versions as rows
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log('📋 DETAILED RESULTS');
  console.log(`${'═'.repeat(80)}\n`);
  
  // Build markdown table with tests as columns
  const testNames = testCases.map(tc => tc.name);
  
  // Print markdown table header
  const headerCols = ['', ...testNames, 'total'];
  console.log('| ' + headerCols.join(' | ') + ' |');
  console.log('| ' + headerCols.map(() => '---').join(' | ') + ' |');
  
  // Print each version as a row
  for (const v of versionsToRun) {
    const versionResults = allResults.filter(r => r.version === v.version);
    const rowValues: number[] = [];
    
    for (const testCase of testCases) {
      const result = versionResults.find(r => r.testName === testCase.name);
      rowValues.push(result ? Math.round(result.opsPerSecond) : 0);
    }
    
    const total = rowValues.reduce((sum, val) => sum + val, 0);
    const rowLabel = `v${v.version} ops/s`;
    console.log('| ' + [rowLabel, ...rowValues.map(v => v.toString()), total.toString()].join(' | ') + ' |');
  }
  
  console.log(`\n${'═'.repeat(80)}`);
  console.log('✅ Benchmark complete!');
  console.log(`${'═'.repeat(80)}\n`);
}

main().catch(console.error);
