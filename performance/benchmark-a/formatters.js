/**
 * Output Formatters
 * Functions for formatting benchmark output
 */

const MEDALS = ["🥇", "🥈", "🥉"];

/**
 * Get medal emoji for rank
 * @param {number} rank
 * @returns {string}
 */
export function getMedal(rank) {
  return rank < MEDALS.length ? MEDALS[rank] : "  ";
}

/**
 * Format duration for display
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format ops per second
 * @param {number} ops
 * @returns {string}
 */
export function formatOps(ops) {
  if (ops >= 1000000) return `${(ops / 1000000).toFixed(2)}M`;
  if (ops >= 1000) return `${(ops / 1000).toFixed(2)}K`;
  return ops.toFixed(2);
}

/**
 * Print summary table
 * @param {Array<{version: string, avgOps: number}>} versionAverages
 */
export function printSummary(versionAverages) {
  console.log(`\n\n${"═".repeat(80)}`);
  console.log("📈 SUMMARY - Average Operations per Second by Version");
  console.log(`${"═".repeat(80)}`);

  console.log("\n   Rank │ Version   │ Avg Ops/s");
  console.log("   ─────┼───────────┼──────────────");
  versionAverages.forEach((v, i) => {
    const medal = getMedal(i);
    console.log(
      `   ${medal} ${(i + 1).toString().padStart(2)} │ v${v.version.padEnd(
        8
      )} │ ${Math.round(v.avgOps).toString().padStart(10)}`
    );
  });
}

/**
 * Print detailed results table in markdown format
 * @param {Array<{name: string, version: string, alasql: any}>} versionsToRun
 * @param {Array<{name: string}>} testCases
 * @param {Array<{version: string, testName: string, opsPerSecond: number}>} allResults
 */
export function printDetailedResults(versionsToRun, testCases, allResults) {
  console.log(`\n\n${"═".repeat(80)}`);
  console.log("📋 DETAILED RESULTS");
  console.log(`${"═".repeat(80)}\n`);

  // Build markdown table with tests as columns
  const testNames = testCases.map((tc) => tc.name);

  // Print markdown table header
  const headerCols = ["", ...testNames, "Total"];
  console.log("| " + headerCols.join(" | ") + " |");
  console.log("| " + headerCols.map(() => "---").join(" | ") + " |");

  // Print each version as a row
  for (const v of versionsToRun) {
    const versionResults = allResults.filter((r) => r.version === v.version);
    const rowValues = [];

    for (const testCase of testCases) {
      const result = versionResults.find((r) => r.testName === testCase.name);
      rowValues.push(result ? Math.round(result.opsPerSecond) : 0);
    }

    const total = rowValues.reduce((sum, val) => sum + val, 0);
    const rowLabel = `v${v.version} ops/s`;
    console.log(
      "| " +
        [rowLabel, ...rowValues.map((v) => v.toString()), total.toString()].join(
          " | "
        ) +
        " |"
    );
  }

  console.log(`\n${"═".repeat(80)}`);
  console.log("✅ Benchmark complete!");
  console.log(`${"═".repeat(80)}\n`);
}
