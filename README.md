# AlaSQL Historical Performance

Performance benchmarks comparing different npm versions of the [AlaSQL](https://github.com/AlaSQL/alasql) library.

## Overview

This project uses [Bun](https://bun.sh/) to benchmark various AlaSQL versions across a range of SQL operations, from simple queries to complex aggregations. It uses npm aliasing to install multiple versions of AlaSQL simultaneously.

## Versions Tested

64 versions across all major releases (sorted by semver):

### 0.x Series

- `0.3.10`, `0.4.12`, `0.5.10`, `0.6.7`, `0.7.1`

### 1.x Series

- `1.7.4`, `1.7.5`

### 2.x Series

- `2.1.4`, `2.1.6`, `2.1.7`, `2.1.8`, `2.2.1`, `2.2.5`, `2.3.0`, `2.5.0`, `2.5.1`, `2.5.3`, `2.5.4`

### 3.x Series

- `3.0.0`, `3.1.0`, `3.1.1`

### 4.x Series

- `4.0.0`, `4.0.2`, `4.0.4`, `4.0.5`, `4.0.6`
- `4.1.0`, `4.1.1`, `4.1.2`, `4.1.3`, `4.1.4`, `4.1.5`, `4.1.7`, `4.1.8`, `4.1.9`, `4.1.10`, `4.1.11`
- `4.2.1`, `4.2.2`, `4.2.3`, `4.2.4`, `4.2.5`, `4.2.6`, `4.2.7`
- `4.3.0`, `4.3.1`, `4.3.2`, `4.3.3`
- `4.4.0`
- `4.5.0`, `4.5.1`, `4.5.2`
- `4.6.0`, `4.6.1`, `4.6.2`, `4.6.3`, `4.6.4`, `4.6.5`, `4.6.6`
- `4.7.0`, `4.8.0`, `4.9.0`
- `4.10.0`, `4.10.1`

## Test Cases

1. **Simple SELECT (100 rows)** - Basic `SELECT *` query on a small dataset
2. **WHERE Filtering (1000 rows)** - SELECT with WHERE clause filtering
3. **JOIN Operation (1000 users, 5000 orders)** - INNER JOIN between two tables
4. **GROUP BY with Aggregations** - GROUP BY with COUNT, SUM, and AVG functions
5. **Subquery Operation** - SELECT with subquery for filtering
6. **Complex Query (ORDER BY, LIMIT)** - Complex aggregation with ORDER BY and LIMIT on large dataset

## Prerequisites

- [Bun](https://bun.sh/) runtime (recommended) or Node.js 18+
- npm or bun package manager

## Installation

```bash
# Install dependencies
npm install
# or
bun install
```

## Usage

### Run Full Benchmark

```bash
bun run benchmark
```

### Run with Custom Cycles

```bash
bun run benchmark.ts --cycles 10  # Run 10 cycles per test
bun run benchmark.ts --cycles 100 # Run 100 cycles per test
```

### Run Directly with Bun

```bash
bun run benchmark.ts
bun run benchmark.ts --cycles 25
```

The benchmark automatically includes the AlaSQL NEXT version by cloning and building the latest code from the [AlaSQL GitHub repository](https://github.com/AlaSQL/alasql).

## How It Works

The project uses npm aliasing to install multiple AlaSQL versions:

```json
{
  "devDependencies": {
    "alasql-0.3.10": "npm:alasql@0.3.10",
    "alasql-0.4.12": "npm:alasql@0.4.12",
    "alasql-4.10.1": "npm:alasql@4.10.1"
    // ... 64 versions total
  }
}
```

Each version can then be imported separately:

```typescript
import alasql0310 from "alasql-0.3.10";
import alasql0412 from "alasql-0.4.12";
import alasql4101 from "alasql-4.10.1";
// ... etc
```

## Sample Output

The benchmark produces formatted output showing performance metrics for each version (actual results will vary based on your machine):

```
╔══════════════════════════════════════════════════════════════════════════════╗
║           AlaSQL Historical Performance Benchmark                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Cycles per test: 50                                                         ║
║  Versions: 0.3.10, 0.4.12, ... 4.10.0, 4.10.1                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test: Simple SELECT (100 rows)
   Basic SELECT * query on a small dataset of 100 rows
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ v0.3.10   │   448.67µs │     22.29K ops/s
   ✅ v0.4.12   │   373.20µs │     26.80K ops/s
   ...
   ✅ v4.10.1   │   501.28µs │     19.95K ops/s
   🏆 Best: v0.4.12 (26.80K ops/s)
```

### SUMMARY Section

The summary table shows average operations per second as plain integers:

```
📈 SUMMARY - Average Operations per Second by Version
═══════════════════════════════════════════════════════════════════════════════

   Rank │ Version   │ Avg Ops/s
   ─────┼───────────┼──────────────
   🥇  1 │ v4.2.5    │      12500
   🥈  2 │ v4.10.1   │      12000
   🥉  3 │ v4.10.0   │      11800
```

### DETAILED RESULTS Section

The detailed results are in markdown table format with versions as rows and tests as columns:

```
| | Simple SELECT (100 rows) | WHERE Filtering (1000 rows) | ... | total |
| --- | --- | --- | --- | --- |
| v0.3.10 ops/s | 22290 | 2510 | ... | 45678 |
| v0.4.12 ops/s | 26800 | 2400 | ... | 48123 |
```

## Adding New Versions

To add a new AlaSQL version to benchmark:

1. Add it to `package.json`:

   ```json
   "alasql-X.Y.Z": "npm:alasql@X.Y.Z"
   ```

2. Import it in `benchmark.ts`:

   ```typescript
   import alasqlXYZ from "alasql-X.Y.Z";
   ```

3. Add it to the `versions` array:

   ```typescript
   { name: 'alasql-X.Y.Z', version: 'X.Y.Z', alasql: alasqlXYZ as AlaSQLInstance },
   ```

4. Run `npm install` or `bun install` and then run the benchmark.

## License

MIT
