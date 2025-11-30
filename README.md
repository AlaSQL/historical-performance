# AlaSQL Historical Performance

Performance benchmarks comparing different npm versions of the [AlaSQL](https://github.com/AlaSQL/alasql) library.

## Overview

This project uses [Bun](https://bun.sh/) to benchmark various AlaSQL versions across a range of SQL operations, from simple queries to complex aggregations. It uses npm aliasing to install multiple versions of AlaSQL simultaneously.

## Project Structure

```
├── alasql-next/              # Git submodule - latest AlaSQL from develop branch
├── performance/
│   ├── benchmark-a/          # Custom benchmark with detailed output
│   │   ├── benchmark.js      # Main entry point
│   │   ├── versions.js       # AlaSQL version imports
│   │   ├── test-cases.js     # SQL test cases
│   │   ├── runner.js         # Benchmark execution logic
│   │   ├── data-generators.js # Test data generation
│   │   └── formatters.js     # Output formatting
│   └── benchmark-b/          # Bun native benchmark
│       ├── benchmark.js      # Uses Bun's bench/group/run
│       ├── versions.js       # AlaSQL version imports
│       └── data-generators.js # Test data generation
├── build-next.sh             # Script to build NEXT version from submodule
└── package.json
```

## Versions Tested

64 npm versions across all major releases, plus the NEXT version (latest from develop branch):

### 0.x - 4.x Series
- `0.3.10` through `4.10.1` (64 versions total)
- `NEXT` - Latest code from the AlaSQL develop branch

## Test Cases

1. **Simple SELECT (100 rows)** - Basic `SELECT *` query on a small dataset
2. **WHERE Filtering (1000 rows)** - SELECT with WHERE clause filtering
3. **JOIN Operation (1000 users, 5000 orders)** - INNER JOIN between two tables
4. **GROUP BY with Aggregations** - GROUP BY with COUNT, SUM, and AVG functions
5. **Subquery Operation** - SELECT with subquery for filtering
6. **Complex Query (ORDER BY, LIMIT)** - Complex aggregation with ORDER BY and LIMIT on large dataset

## Prerequisites

- [Bun](https://bun.sh/) runtime
- Git (for submodule management)
- npm or yarn

## Installation

```bash
# Clone with submodules
git clone --recurse-submodules <repo-url>
cd historical-performance

# Install dependencies
bun install
# or
yarn install
```

## Usage

### Benchmark A - Custom Implementation

Custom benchmark with detailed console output, summary tables, and markdown results.

```bash
yarn bench-a
```

With custom cycles:
```bash
yarn bench-a --cycles 10
```

### Benchmark B - Bun Native

Uses Bun's native `bench`, `group`, and `run` functions for performance measurement.

```bash
yarn bench-b
```

## How It Works

### Version Management

The project uses npm aliasing to install multiple AlaSQL versions:

```json
{
  "devDependencies": {
    "alasql-0.3.10": "npm:alasql@0.3.10",
    "alasql-4.10.1": "npm:alasql@4.10.1"
  }
}
```

### NEXT Version

The NEXT version is managed as a git submodule pointing to the AlaSQL develop branch. The `build-next.sh` script handles:

1. Updating the submodule to latest
2. Installing dependencies
3. Building the distribution

## Sample Output (Benchmark A)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║           AlaSQL Historical Performance Benchmark (A)                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Cycles per test: 50                                                         ║
║  Versions: 0.3.10, 0.4.12, ... 4.10.1, NEXT-abc123                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 Test: Simple SELECT (100 rows)
   ✅ v0.3.10   │   448.67µs │     22.29K ops/s
   ✅ v4.10.1   │   501.28µs │     19.95K ops/s
   🏆 Best: v0.4.12 (26.80K ops/s)
```

### SUMMARY Section

```
📈 SUMMARY - Average Operations per Second by Version

   Rank │ Version   │ Avg Ops/s
   ─────┼───────────┼──────────────
   🥇  1 │ v4.2.5    │      12500
   🥈  2 │ v4.10.1   │      12000
   🥉  3 │ v4.10.0   │      11800
```

### DETAILED RESULTS Section

```
| | Simple SELECT (100 rows) | WHERE Filtering (1000 rows) | ... | Total |
| --- | --- | --- | --- | --- |
| v0.3.10 ops/s | 22290 | 2510 | ... | 45678 |
| vNEXT-abc123 ops/s | 26800 | 2400 | ... | 48123 |
```

## Adding New Versions

To add a new AlaSQL version:

1. Add to `package.json`:
   ```json
   "alasql-X.Y.Z": "npm:alasql@X.Y.Z"
   ```

2. Import in both `performance/benchmark-a/versions.js` and `performance/benchmark-b/versions.js`:
   ```javascript
   import alasqlXYZ from "alasql-X.Y.Z";
   ```

3. Add to the `versions` array in both files:
   ```javascript
   { name: "alasql-X.Y.Z", version: "X.Y.Z", alasql: alasqlXYZ },
   ```

4. Run `bun install` or `yarn install`

## License

MIT
