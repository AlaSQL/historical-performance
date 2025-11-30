# AlaSQL Historical Performance

Performance benchmarks comparing different npm versions of the [AlaSQL](https://github.com/AlaSQL/alasql) library.

## Overview

This project uses [Bun](https://bun.sh/) to benchmark various AlaSQL versions across a range of SQL operations, from simple queries to complex aggregations. It uses npm aliasing to install multiple versions of AlaSQL simultaneously.

## Versions Tested

- `0.4.11` - Early version
- `1.7.5` - First 1.x release
- `2.0.0` - Major version 2
- `3.0.0` - Major version 3
- `4.0.0` - Major version 4
- `4.10.1` - Latest version

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

### Run Quick Benchmark (fewer iterations)

```bash
bun run benchmark:quick
```

### Run Directly with Bun

```bash
bun run benchmark.ts
bun run benchmark.ts --quick
```

## How It Works

The project uses npm aliasing to install multiple AlaSQL versions:

```json
{
  "devDependencies": {
    "alasql-0.4.11": "npm:alasql@0.4.11",
    "alasql-1.7.5": "npm:alasql@1.7.5",
    "alasql-2.0.0": "npm:alasql@2.0.0",
    "alasql-3.0.0": "npm:alasql@3.0.0",
    "alasql-4.0.0": "npm:alasql@4.0.0",
    "alasql-4.10.1": "npm:alasql@4.10.1"
  }
}
```

Each version can then be imported separately:

```typescript
import alasql0411 from 'alasql-0.4.11';
import alasql175 from 'alasql-1.7.5';
// ... etc
```

## Sample Output

The benchmark produces formatted output showing performance metrics for each version (actual results will vary based on your machine):

```
╔══════════════════════════════════════════════════════════════════════════════╗
║           AlaSQL Historical Performance Benchmark                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Mode: Quick                                                                 ║
║  Iterations per test: 10                                                     ║
║  Versions: 0.4.11, 1.7.5, 2.0.0, 3.0.0, 4.0.0, 4.10.1                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test: Simple SELECT (100 rows)
   Basic SELECT * query on a small dataset of 100 rows
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ v0.4.11   │   495.63µs │     20.18K ops/s
   ✅ v1.7.5    │   476.93µs │     20.97K ops/s
   ...
```

## Adding New Versions

To add a new AlaSQL version to benchmark:

1. Add it to `package.json`:
   ```json
   "alasql-X.Y.Z": "npm:alasql@X.Y.Z"
   ```

2. Import it in `benchmark.ts`:
   ```typescript
   import alasqlXYZ from 'alasql-X.Y.Z';
   ```

3. Add it to the `versions` array:
   ```typescript
   { name: 'alasql-X.Y.Z', version: 'X.Y.Z', alasql: alasqlXYZ as AlaSQLInstance },
   ```

4. Run `npm install` or `bun install` and then run the benchmark.

## License

MIT
