/**
 * AlaSQL Version Imports
 * All AlaSQL versions imported with aliases for benchmarking
 */

import alasql0310 from "alasql-0.3.10";
import alasql0412 from "alasql-0.4.12";
import alasql0510 from "alasql-0.5.10";
import alasql067 from "alasql-0.6.7";
import alasql071 from "alasql-0.7.1";
import alasql174 from "alasql-1.7.4";
import alasql175 from "alasql-1.7.5";
import alasql214 from "alasql-2.1.4";
import alasql216 from "alasql-2.1.6";
import alasql217 from "alasql-2.1.7";
import alasql218 from "alasql-2.1.8";
import alasql221 from "alasql-2.2.1";
import alasql225 from "alasql-2.2.5";
import alasql230 from "alasql-2.3.0";
import alasql250 from "alasql-2.5.0";
import alasql251 from "alasql-2.5.1";
import alasql253 from "alasql-2.5.3";
import alasql254 from "alasql-2.5.4";
import alasql300 from "alasql-3.0.0";
import alasql310 from "alasql-3.1.0";
import alasql311 from "alasql-3.1.1";
import alasql400 from "alasql-4.0.0";
import alasql402 from "alasql-4.0.2";
import alasql404 from "alasql-4.0.4";
import alasql405 from "alasql-4.0.5";
import alasql406 from "alasql-4.0.6";
import alasql410 from "alasql-4.1.0";
import alasql411 from "alasql-4.1.1";
import alasql412 from "alasql-4.1.2";
import alasql413 from "alasql-4.1.3";
import alasql414 from "alasql-4.1.4";
import alasql415 from "alasql-4.1.5";
import alasql417 from "alasql-4.1.7";
import alasql418 from "alasql-4.1.8";
import alasql419 from "alasql-4.1.9";
import alasql4110 from "alasql-4.1.10";
import alasql4111 from "alasql-4.1.11";
import alasql421 from "alasql-4.2.1";
import alasql422 from "alasql-4.2.2";
import alasql423 from "alasql-4.2.3";
import alasql424 from "alasql-4.2.4";
import alasql425 from "alasql-4.2.5";
import alasql426 from "alasql-4.2.6";
import alasql427 from "alasql-4.2.7";
import alasql430 from "alasql-4.3.0";
import alasql431 from "alasql-4.3.1";
import alasql432 from "alasql-4.3.2";
import alasql433 from "alasql-4.3.3";
import alasql440 from "alasql-4.4.0";
import alasql450 from "alasql-4.5.0";
import alasql451 from "alasql-4.5.1";
import alasql452 from "alasql-4.5.2";
import alasql460 from "alasql-4.6.0";
import alasql461 from "alasql-4.6.1";
import alasql462 from "alasql-4.6.2";
import alasql463 from "alasql-4.6.3";
import alasql464 from "alasql-4.6.4";
import alasql465 from "alasql-4.6.5";
import alasql466 from "alasql-4.6.6";
import alasql470 from "alasql-4.7.0";
import alasql480 from "alasql-4.8.0";
import alasql490 from "alasql-4.9.0";
import alasql4100 from "alasql-4.10.0";
import alasql4101 from "alasql-4.10.1";

import * as path from "path";
import * as fs from "fs";

/**
 * @typedef {function(string, unknown[]?): unknown} AlaSQLInstance
 */

/**
 * @typedef {Object} VersionedAlaSQL
 * @property {string} name
 * @property {string} version
 * @property {AlaSQLInstance} alasql
 */

/** @type {VersionedAlaSQL[]} */
export const versions = [
  { name: "alasql-0.3.10", version: "0.3.10", alasql: alasql0310 },
  { name: "alasql-0.4.12", version: "0.4.12", alasql: alasql0412 },
  { name: "alasql-0.5.10", version: "0.5.10", alasql: alasql0510 },
  { name: "alasql-0.6.7", version: "0.6.7", alasql: alasql067 },
  { name: "alasql-0.7.1", version: "0.7.1", alasql: alasql071 },
  { name: "alasql-1.7.4", version: "1.7.4", alasql: alasql174 },
  { name: "alasql-1.7.5", version: "1.7.5", alasql: alasql175 },
  { name: "alasql-2.1.4", version: "2.1.4", alasql: alasql214 },
  { name: "alasql-2.1.6", version: "2.1.6", alasql: alasql216 },
  { name: "alasql-2.1.7", version: "2.1.7", alasql: alasql217 },
  { name: "alasql-2.1.8", version: "2.1.8", alasql: alasql218 },
  { name: "alasql-2.2.1", version: "2.2.1", alasql: alasql221 },
  { name: "alasql-2.2.5", version: "2.2.5", alasql: alasql225 },
  { name: "alasql-2.3.0", version: "2.3.0", alasql: alasql230 },
  { name: "alasql-2.5.0", version: "2.5.0", alasql: alasql250 },
  { name: "alasql-2.5.1", version: "2.5.1", alasql: alasql251 },
  { name: "alasql-2.5.3", version: "2.5.3", alasql: alasql253 },
  { name: "alasql-2.5.4", version: "2.5.4", alasql: alasql254 },
  { name: "alasql-3.0.0", version: "3.0.0", alasql: alasql300 },
  { name: "alasql-3.1.0", version: "3.1.0", alasql: alasql310 },
  { name: "alasql-3.1.1", version: "3.1.1", alasql: alasql311 },
  { name: "alasql-4.0.0", version: "4.0.0", alasql: alasql400 },
  { name: "alasql-4.0.2", version: "4.0.2", alasql: alasql402 },
  { name: "alasql-4.0.4", version: "4.0.4", alasql: alasql404 },
  { name: "alasql-4.0.5", version: "4.0.5", alasql: alasql405 },
  { name: "alasql-4.0.6", version: "4.0.6", alasql: alasql406 },
  { name: "alasql-4.1.0", version: "4.1.0", alasql: alasql410 },
  { name: "alasql-4.1.1", version: "4.1.1", alasql: alasql411 },
  { name: "alasql-4.1.2", version: "4.1.2", alasql: alasql412 },
  { name: "alasql-4.1.3", version: "4.1.3", alasql: alasql413 },
  { name: "alasql-4.1.4", version: "4.1.4", alasql: alasql414 },
  { name: "alasql-4.1.5", version: "4.1.5", alasql: alasql415 },
  { name: "alasql-4.1.7", version: "4.1.7", alasql: alasql417 },
  { name: "alasql-4.1.8", version: "4.1.8", alasql: alasql418 },
  { name: "alasql-4.1.9", version: "4.1.9", alasql: alasql419 },
  { name: "alasql-4.1.10", version: "4.1.10", alasql: alasql4110 },
  { name: "alasql-4.1.11", version: "4.1.11", alasql: alasql4111 },
  { name: "alasql-4.2.1", version: "4.2.1", alasql: alasql421 },
  { name: "alasql-4.2.2", version: "4.2.2", alasql: alasql422 },
  { name: "alasql-4.2.3", version: "4.2.3", alasql: alasql423 },
  { name: "alasql-4.2.4", version: "4.2.4", alasql: alasql424 },
  { name: "alasql-4.2.5", version: "4.2.5", alasql: alasql425 },
  { name: "alasql-4.2.6", version: "4.2.6", alasql: alasql426 },
  { name: "alasql-4.2.7", version: "4.2.7", alasql: alasql427 },
  { name: "alasql-4.3.0", version: "4.3.0", alasql: alasql430 },
  { name: "alasql-4.3.1", version: "4.3.1", alasql: alasql431 },
  { name: "alasql-4.3.2", version: "4.3.2", alasql: alasql432 },
  { name: "alasql-4.3.3", version: "4.3.3", alasql: alasql433 },
  { name: "alasql-4.4.0", version: "4.4.0", alasql: alasql440 },
  { name: "alasql-4.5.0", version: "4.5.0", alasql: alasql450 },
  { name: "alasql-4.5.1", version: "4.5.1", alasql: alasql451 },
  { name: "alasql-4.5.2", version: "4.5.2", alasql: alasql452 },
  { name: "alasql-4.6.0", version: "4.6.0", alasql: alasql460 },
  { name: "alasql-4.6.1", version: "4.6.1", alasql: alasql461 },
  { name: "alasql-4.6.2", version: "4.6.2", alasql: alasql462 },
  { name: "alasql-4.6.3", version: "4.6.3", alasql: alasql463 },
  { name: "alasql-4.6.4", version: "4.6.4", alasql: alasql464 },
  { name: "alasql-4.6.5", version: "4.6.5", alasql: alasql465 },
  { name: "alasql-4.6.6", version: "4.6.6", alasql: alasql466 },
  { name: "alasql-4.7.0", version: "4.7.0", alasql: alasql470 },
  { name: "alasql-4.8.0", version: "4.8.0", alasql: alasql480 },
  { name: "alasql-4.9.0", version: "4.9.0", alasql: alasql490 },
  { name: "alasql-4.10.0", version: "4.10.0", alasql: alasql4100 },
  { name: "alasql-4.10.1", version: "4.10.1", alasql: alasql4101 },
];

/**
 * Load the NEXT version of AlaSQL from the submodule
 * @returns {Promise<VersionedAlaSQL|null>}
 */
export async function loadAlasqlNext() {
  try {
    const nextDir = path.join(process.cwd(), "alasql-next");
    const distPath = path.join(nextDir, "dist", "alasql.js");

    if (!fs.existsSync(distPath)) {
      console.log("   ⚠️ AlaSQL NEXT not built. Run ./build-next.sh first.");
      return null;
    }

    // Get commit hash
    const { execSync } = await import("child_process");
    const commitHash = execSync("git rev-parse --short HEAD", {
      cwd: nextDir,
      encoding: "utf-8",
    }).trim();

    const moduleNext = await import(distPath);
    const alasql = moduleNext.default || moduleNext;

    console.log(`   ✅ Loaded AlaSQL NEXT (commit: ${commitHash})`);

    return {
      name: "alasql-next",
      version: `NEXT-${commitHash}`,
      alasql,
    };
  } catch (error) {
    console.error(
      `   ❌ Failed to load AlaSQL NEXT: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return null;
  }
}
