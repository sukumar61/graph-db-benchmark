# Graph Database Benchmark

A benchmark project comparing the performance of five graph databases using common graph lookup, traversal, and aggregation workloads.

## Databases Compared

- CognoDB
- Neo4j
- Memgraph
- ArangoDB
- LadybugDB

## Dataset

The benchmark uses the SNAP soc-Pokec relationship dataset/subset.

The dataset represents relationships between users and is used to evaluate graph lookup, traversal, and aggregation operations.

## Benchmark Workloads

### 1. Point Lookup

Find a user/node using its identifier.

### 2. 1-Hop Traversal

Traverse one relationship from a user to a directly connected user.

User → Friend

### 3. 2-Hop Traversal

Traverse two relationship levels.

User → Friend → Friend

### 4. 3-Hop Traversal

Traverse three relationship levels.

User → Friend → Friend → Friend

### 5. Aggregation

Execute an aggregation query over graph relationships.

## Benchmark Methodology

Each workload is executed for 100 iterations.

Execution time is measured using high-resolution timers and recorded in milliseconds (ms).

The primary comparison metric is the average execution time.

Lower execution time indicates better performance.

## Benchmark Results

All values represent average query execution time in milliseconds (ms).

Lower is better.

| Database | Lookup Avg | 1-Hop Avg | 2-Hop Avg | 3-Hop Avg | Aggregation Avg |
|---|---:|---:|---:|---:|---:|
| LadybugDB | 7.914 | 9.511 | 21.786 | 24.037 | 9.154 |
| ArangoDB | 64.585 | 64.637 | 66.526 | 71.250 | 66.450 |
| Neo4j | 117.916 | 101.488 | 112.074 | 96.870 | 104.244 |
| Memgraph | 161.970 | 154.121 | 154.231 | 153.992 | 154.360 |
| CognoDB | 376.398 | 363.778 | 339.289 | 397.556 | 358.919 |

Detailed results are available in:

results/
├── arango-results.json
├── cognodb-results.json
├── ladybug-results.json
├── memgraph-results.json
├── neo4j-results.json
└── comparison.md

## Resource and Fairness

The assessment requires the databases to run under equivalent resource limits.

The following specifications should be documented for each database:

- vCPU
- RAM
- Storage
- Database version
- Deployment type

### CognoDB

The CognoDB cloud deployment used during testing was configured with:

- vCPU: up to 0.5 vCPU burst
- RAM: 512 MB
- Storage: 1 GiB
- Deployment: Cloud-hosted
- Version: 0.9.11

The exact resource configuration for the other database deployments should be documented from their respective environments.

For a controlled comparison, all databases should use equivalent CPU, RAM, and storage limits, the same dataset, the same logical workload, and the same number of benchmark iterations.

## Project Structure

graph-db-benchmark/
├── charts/
├── datasets/
│   └── soc-pokec-relationships/
├── results/
│   ├── arango-results.json
│   ├── cognodb-results.json
│   ├── ladybug-results.json
│   ├── memgraph-results.json
│   ├── neo4j-results.json
│   └── comparison.md
├── src/
│   ├── benchmarks/
│   ├── config/
│   ├── controllers/
│   ├── loaders/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── runArangoBenchmark.js
│   ├── runCognoBenchmark.js
│   └── runLadybugBenchmark.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

## Installation

Install the project dependencies:

npm install

## Environment Variables

Database credentials are stored in a local .env file.

The .env file is excluded from Git.

Example:

COGNO_URI=your-cognodb-uri
COGNO_USERNAME=your-username
COGNO_PASSWORD=your-password

Never commit real database credentials to the repository.

## Running the Benchmarks

### ArangoDB

node src/runArangoBenchmark.js

Results:

results/arango-results.json

### CognoDB

node src/runCognoBenchmark.js

Results:

results/cognodb-results.json

### LadybugDB

node src/runLadybugBenchmark.js

Results:

results/ladybug-results.json

Neo4j and Memgraph benchmark results are included in the results/ directory.

## Results Interpretation

Based on the measured averages in this benchmark run:

1. LadybugDB produced the lowest measured execution times.
2. ArangoDB was the next fastest.
3. Neo4j showed moderate execution times.
4. Memgraph showed higher execution times than Neo4j.
5. CognoDB showed the highest measured execution times.

These results apply only to this benchmark configuration and should not be treated as a universal ranking of graph databases.

## Fairness Considerations

For a controlled comparison, databases should use:

- The same dataset
- The same logical queries
- The same number of iterations
- Equivalent CPU resources
- Equivalent RAM limits
- Equivalent storage limits
- Comparable database configurations
- The same client-side timing methodology

Other factors that can affect results include:

- Network latency
- Database caching
- Index configuration
- Query planner behavior
- Storage performance
- Cloud versus local deployment
- Connection overhead

## Limitations

This benchmark focuses on:

- Point lookup
- 1-hop traversal
- 2-hop traversal
- 3-hop traversal
- Aggregation

It does not currently measure:

- Write throughput
- Concurrent query performance
- Transaction throughput
- Replication
- Failover
- Horizontal scaling
- Recovery performance
- Memory consumption per query
- Storage engine efficiency
- Large-scale distributed workloads

## Reproducibility

The benchmark can be reproduced using the included scripts.

General workflow:

Install dependencies
↓
Configure database credentials
↓
Load the benchmark dataset
↓
Run the database benchmark
↓
Execute 100 iterations
↓
Save results as JSON
↓
Compare average execution times

## Conclusion

This project provides a practical comparison of five graph databases using common graph workloads.

In this benchmark run, LadybugDB produced the lowest measured average execution times, followed by ArangoDB, Neo4j, Memgraph, and CognoDB.

The results are specific to the tested environment, dataset, queries, configuration, and resource allocation and should therefore be interpreted within those constraints.
