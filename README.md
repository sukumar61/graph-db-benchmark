# Graph Database Benchmark

## Overview

This project benchmarks the performance of graph databases using a common social network dataset. The benchmark measures the execution time of common graph operations under identical workloads to compare performance across different graph database platforms.

The benchmark currently includes:

- CognoDB Cloud
- Neo4j AuraDB
- Memgraph Cloud

The benchmark evaluates:

- Node Lookup
- Graph Traversal
- Aggregation Queries
- Query Latency
- Throughput

---

# Features

- Graph dataset loading
- Automated benchmark execution
- Lookup Benchmark
- One-Hop Traversal Benchmark
- Two-Hop Traversal Benchmark
- Three-Hop Traversal Benchmark
- Aggregation Benchmark
- REST API for running benchmarks
- JSON result generation

---

# Project Structure

```
graph-db-benchmark/
│
├── datasets/
│   └── soc-pokec-relationships/
│
├── results/
│   ├── cognodb-results.json
│   ├── neo4j-results.json
│   └── memgraph-results.json
│
├── src/
│   ├── benchmarks/
│   ├── config/
│   ├── controllers/
│   ├── loaders/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── package.json
├── .env.example
└── README.md
```

---

# Technologies Used

- Node.js
- Express.js
- JavaScript
- Neo4j Driver
- Cypher Query Language

Graph Databases

- CognoDB Cloud
- Neo4j AuraDB
- Memgraph Cloud

---

# Dataset

**Dataset Name**

Pokec Social Network Dataset

**Source**

Stanford Network Analysis Project (SNAP)

The dataset represents user relationships in a social network where each row contains a directed relationship between two users.

Example:

```
1 5
1 8
2 7
4 1
```

---

# Benchmark Operations

## 1. Lookup Benchmark

Retrieves a node using its unique identifier.

```cypher
MATCH (u:User {id:$id})
RETURN u
```

---

## 2. One-Hop Traversal

Retrieves immediate neighboring nodes.

```cypher
MATCH (u:User {id:$id})-[:KNOWS]->(friend)
RETURN friend
```

---

## 3. Two-Hop Traversal

Traverses two relationships.

```cypher
MATCH (u:User {id:$id})-[:KNOWS]->()-[:KNOWS]->(friend)
RETURN DISTINCT friend
```

---

## 4. Three-Hop Traversal

Traverses up to three relationships.

```cypher
MATCH (u:User {id:$id})-[:KNOWS*1..3]->(friend)
RETURN DISTINCT friend
```

---

## 5. Aggregation Benchmark

Counts total relationships.

```cypher
MATCH (u:User)-[:KNOWS]->(friend)
RETURN count(friend)
```

---

# Performance Metrics

The benchmark records:

- Average Latency
- Median Latency
- Minimum Latency
- Maximum Latency
- P95 Latency
- Throughput

---

# Installation

Clone the repository

```bash
git clone https://github.com/<your-github-username>/graph-db-benchmark.git
```

Move into the project

```bash
cd graph-db-benchmark
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file.

Example:

```env
DB_URI=
DB_USERNAME=
DB_PASSWORD=
```

---

# Running the Project

Start the application

```bash
npm start
```

Run the benchmark

```
GET http://localhost:3000/benchmark
```

---

# Sample Response

```json
{
  "success": true,
  "data": {
    "lookup": {},
    "oneHop": {},
    "twoHop": {},
    "threeHop": {},
    "aggregation": {}
  }
}
```

---

# Benchmark Results

Benchmark outputs are stored in the `results` directory.

```
results/
├── cognodb-results.json
├── neo4j-results.json
└── memgraph-results.json
```

---

# Databases Benchmarked

| Database | Status |
|----------|--------|
| CognoDB Cloud | ✅ Completed |
| Neo4j AuraDB | ✅ Completed |
| Memgraph Cloud | ✅ Completed |

---

# Future Improvements

The benchmark framework can be extended to include additional graph databases such as:

- FalkorDB
- Neo4j Community Edition
- Apache AGE
- KuzuDB

Additional benchmark metrics, visualization dashboards, and performance analysis can also be incorporated.

---

# Author

**Renukuntla Sukumar**

### LinkedIn

https://www.linkedin.com/in/sukumar-renukuntla-078686236/



## Acknowledgements

- Stanford SNAP for providing the Pokec Social Network Dataset.
- CognoDB Cloud
- Neo4j AuraDB
- Memgraph Cloud
