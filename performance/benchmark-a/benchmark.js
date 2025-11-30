/**
 * AlaSQL Historical Performance Benchmark (Benchmark A)
 *
 * Custom benchmark implementation with detailed output.
 * Run with: yarn bench-a
 */

import { versions, loadAlasqlNext } from "./versions.js";
import { testCases } from "./test-cases.js";
import { runBenchmark } from "./runner.js";
import {
  formatDuration,
  formatOps,
  printSummary,
  printDetailedResults,
} from "./formatters.js";

/**
 * Parse cycles from command line
 * @returns {number}
 */
function parseCycles() {
  const cyclesIndex = process.argv.findIndex((arg) => arg === "--cycles");
  if (cyclesIndex !== -1 && process.argv[cyclesIndex + 1]) {
    const cycles = parseInt(process.argv[cyclesIndex + 1], 10);
    if (!isNaN(cycles) && cycles > 0) {
      return cycles;
    }
  }
  return 50; // Default to 50 cycles
}

/**
 * Main benchmark runner
 */
async function main() {
  const iterations = parseCycles();

  // Build list of versions to benchmark
  const versionsToRun = [...versions];

  // Always include NEXT version
  const nextVersion = await loadAlasqlNext();
  if (nextVersion) {
    versionsToRun.push(nextVersion);
  }

  console.log(
    "╔══════════════════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║           AlaSQL Historical Performance Benchmark (A)                        ║"
  );
  console.log(
    "╠══════════════════════════════════════════════════════════════════════════════╣"
  );
  console.log(
    `║  Cycles per test: ${iterations}                                                        ║`
  );
  console.log(
    `║  Versions: ${versionsToRun.map((v) => v.version).join(", ")}                     ║`
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════════════════════╝"
  );
  console.log("");

  const allResults = [];

  for (const testCase of testCases) {
    console.log(`\n${"━".repeat(80)}`);
    console.log(`📊 Test: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    console.log(`${"━".repeat(80)}`);

    const testResults = [];

    for (const { name, version, alasql } of versionsToRun) {
      try {
        const result = runBenchmark(alasql, testCase, iterations);
        const opsPerSecond = (result.iterations / result.duration) * 1000;

        const benchmarkResult = {
          version,
          testName: testCase.name,
          duration: result.duration,
          iterations: result.iterations,
          opsPerSecond,
        };

        testResults.push(benchmarkResult);
        allResults.push(benchmarkResult);

        console.log(
          `   ✅ v${version.padEnd(8)} │ ${formatDuration(
            result.duration
          ).padStart(10)} │ ${formatOps(opsPerSecond).padStart(10)} ops/s`
        );
      } catch (error) {
        console.log(
          `   ❌ v${version.padEnd(8)} │ Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Find best performer for this test
    if (testResults.length > 0) {
      const best = testResults.reduce((a, b) =>
        a.opsPerSecond > b.opsPerSecond ? a : b
      );
      console.log(
        `   🏆 Best: v${best.version} (${formatOps(best.opsPerSecond)} ops/s)`
      );
    }
  }

  // Calculate averages per version
  const versionAverages = versionsToRun.map((v) => {
    const versionResults = allResults.filter((r) => r.version === v.version);
    const avgOps =
      versionResults.reduce((sum, r) => sum + r.opsPerSecond, 0) /
      versionResults.length;
    return { version: v.version, avgOps };
  });

  // Sort by average ops
  versionAverages.sort((a, b) => b.avgOps - a.avgOps);

  // Print summary and detailed results
  printSummary(versionAverages);
  printDetailedResults(versionsToRun, testCases, allResults);
}

main().catch(console.error);
