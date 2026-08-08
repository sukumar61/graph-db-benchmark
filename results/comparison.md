# Graph Database Benchmark Comparison

All values are average query execution time in milliseconds (ms). Lower is better.

| Database | Lookup Avg | 1-Hop Avg | 2-Hop Avg | 3-Hop Avg | Aggregation Avg |
|---|---:|---:|---:|---:|---:|
| LadybugDB | 7.914 | 9.511 | 21.786 | 24.037 | 9.154 |
| ArangoDB | 64.585 | 64.637 | 66.526 | 71.250 | 66.450 |
| Neo4j | 117.916 | 101.488 | 112.074 | 96.870 | 104.244 |
| Memgraph | 161.970 | 154.121 | 154.231 | 153.992 | 154.360 |
| CognoDB | 376.398 | 363.778 | 339.289 | 397.556 | 358.919 |

## Methodology

- 100 iterations per benchmark.
- Benchmarks:
  - Point lookup
  - 1-hop traversal
  - 2-hop traversal
  - 3-hop traversal
  - Aggregation
- Execution time is measured in milliseconds.
- Lower execution time indicates better performance.
- The benchmark uses the `soc-pokec-relationships` dataset.
