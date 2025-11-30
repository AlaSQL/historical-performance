/**
 * Test Data Generators
 * Functions to generate sample data for benchmarking
 */

/**
 * Generate user data
 * @param {number} count - Number of users to generate
 * @returns {Array<{id: number, name: string, age: number, department: string, salary: number}>}
 */
export function generateUsers(count) {
  const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance"];
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${
      lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    }`,
    age: 22 + (i % 43),
    department: departments[i % departments.length],
    salary: 30000 + ((i * 500) % 70000),
  }));
}

/**
 * Generate order data
 * @param {number} count - Number of orders to generate
 * @param {number} maxUserId - Maximum user ID for foreign key
 * @returns {Array<{id: number, userId: number, product: string, amount: number, date: string}>}
 */
export function generateOrders(count, maxUserId) {
  const products = [
    "Laptop",
    "Phone",
    "Tablet",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Camera",
  ];
  const currentYear = new Date().getFullYear();

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId: (i % maxUserId) + 1,
    product: products[i % products.length],
    amount: 10 + ((i * 7) % 990),
    date: `${currentYear}-${String((i % 12) + 1).padStart(2, "0")}-${String(
      (i % 28) + 1
    ).padStart(2, "0")}`,
  }));
}
