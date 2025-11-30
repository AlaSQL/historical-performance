/**
 * Benchmark Runner Utilities
 * Core benchmark execution and timing logic
 */

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

/**
 * @typedef {Object} BenchmarkResult
 * @property {string} version
 * @property {string} testName
 * @property {number} duration
 * @property {number} iterations
 * @property {number} opsPerSecond
 */

/**
 * Run a benchmark for a specific test case
 * @param {AlaSQLInstance} alasql
 * @param {TestCase} testCase
 * @param {number} iterations
 * @returns {{duration: number, iterations: number}}
 */
export function runBenchmark(alasql, testCase, iterations) {
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
