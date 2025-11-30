/**
 * Test Cases
 * SQL test cases for benchmarking AlaSQL versions
 */

import { generateUsers, generateOrders } from "./data-generators.js";

/**
 * @typedef {function(string, unknown[]?): unknown} AlaSQLInstance
 */

/**
 * @typedef {Object} TestCase
 * @property {string} name
 * @property {string} description
 * @property {function(AlaSQLInstance): void} setup
 * @property {function(AlaSQLInstance): unknown} run
 * @property {function(AlaSQLInstance): void} teardown
 */

/** @type {TestCase[]} */
export const testCases = [
  // Test 1: Simple SELECT on small dataset
  {
    name: "Simple SELECT (100 rows)",
    description: "Basic SELECT * query on a small dataset of 100 rows",
    setup: (alasql) => {
      alasql("CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT)");
      const users = generateUsers(100);
      alasql("DELETE FROM users");
      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?)", [u.id, u.name, u.age])
      );
    },
    run: (alasql) => {
      return alasql("SELECT * FROM users");
    },
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
    },
  },

  // Test 2: SELECT with WHERE clause filtering
  {
    name: "WHERE Filtering (1000 rows)",
    description: "SELECT with WHERE clause filtering on a dataset of 1000 rows",
    setup: (alasql) => {
      alasql(
        "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING)"
      );
      const users = generateUsers(1000);
      alasql("DELETE FROM users");
      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?, ?)", [
          u.id,
          u.name,
          u.age,
          u.department,
        ])
      );
    },
    run: (alasql) => {
      return alasql("SELECT * FROM users WHERE age > 30 AND department = ?", [
        "Engineering",
      ]);
    },
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
    },
  },

  // Test 3: JOIN operation
  {
    name: "JOIN Operation (1000 users, 5000 orders)",
    description: "INNER JOIN between users and orders tables",
    setup: (alasql) => {
      alasql(
        "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
      );
      alasql(
        "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
      );

      const users = generateUsers(1000);
      const orders = generateOrders(5000, 1000);

      alasql("DELETE FROM users");
      alasql("DELETE FROM orders");

      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
          u.id,
          u.name,
          u.age,
          u.department,
          u.salary,
        ])
      );
      orders.forEach((o) =>
        alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
          o.id,
          o.userId,
          o.product,
          o.amount,
          o.date,
        ])
      );
    },
    run: (alasql) => {
      return alasql(
        "SELECT u.name, o.product, o.amount FROM users u INNER JOIN orders o ON u.id = o.userId WHERE o.amount > 500"
      );
    },
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },

  // Test 4: GROUP BY with aggregations
  {
    name: "GROUP BY with Aggregations",
    description: "GROUP BY with COUNT, SUM, and AVG aggregations",
    setup: (alasql) => {
      alasql(
        "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
      );

      const users = generateUsers(5000);
      alasql("DELETE FROM users");
      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
          u.id,
          u.name,
          u.age,
          u.department,
          u.salary,
        ])
      );
    },
    run: (alasql) => {
      return alasql(
        "SELECT department, COUNT(*) as cnt, SUM(salary) as totalSalary, AVG(age) as avgAge FROM users GROUP BY department"
      );
    },
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
    },
  },

  // Test 5: Subqueries
  {
    name: "Subquery Operation",
    description: "SELECT with subquery for filtering",
    setup: (alasql) => {
      alasql(
        "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
      );
      alasql(
        "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
      );

      const users = generateUsers(1000);
      const orders = generateOrders(3000, 1000);

      alasql("DELETE FROM users");
      alasql("DELETE FROM orders");

      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
          u.id,
          u.name,
          u.age,
          u.department,
          u.salary,
        ])
      );
      orders.forEach((o) =>
        alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
          o.id,
          o.userId,
          o.product,
          o.amount,
          o.date,
        ])
      );
    },
    run: (alasql) => {
      return alasql(
        "SELECT 1 -- * FROM users WHERE id IN (SELECT userId FROM orders WHERE amount > 800)"
      );
    },
    teardown: (alasql) => {
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },

  // Test 6: Complex query with ORDER BY, LIMIT
  {
    name: "Complex Query (ORDER BY, LIMIT)",
    description: "Complex aggregation with ORDER BY and LIMIT on large dataset",
    setup: (alasql) => {
      alasql(
        "CREATE TABLE IF NOT EXISTS users (id INT, name STRING, age INT, department STRING, salary NUMBER)"
      );
      alasql(
        "CREATE TABLE IF NOT EXISTS orders (id INT, userId INT, product STRING, amount NUMBER, date STRING)"
      );

      const users = generateUsers(2000);
      const orders = generateOrders(10000, 2000);

      alasql("DELETE FROM users");
      alasql("DELETE FROM orders");

      users.forEach((u) =>
        alasql("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [
          u.id,
          u.name,
          u.age,
          u.department,
          u.salary,
        ])
      );
      orders.forEach((o) =>
        alasql("INSERT INTO orders VALUES (?, ?, ?, ?, ?)", [
          o.id,
          o.userId,
          o.product,
          o.amount,
          o.date,
        ])
      );
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
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS orders");
    },
  },
];
