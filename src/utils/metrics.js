function calculateMetrics(times) {
  if (!times || times.length === 0) {
    return {
      average: 0,
      minimum: 0,
      maximum: 0,
      median: 0,
      p95: 0,
      throughput: 0,
    };
  }

  const sorted = [...times].sort((a, b) => a - b);

  const total = sorted.reduce((sum, time) => sum + time, 0);

  const average = total / sorted.length;

  const minimum = sorted[0];

  const maximum = sorted[sorted.length - 1];

  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const p95 =
    sorted[Math.floor(sorted.length * 0.95)];

  
  const throughput =
    total === 0 ? 0 : (sorted.length / total) * 1000;

  return {
    average: Number(average.toFixed(3)),
    minimum: Number(minimum.toFixed(3)),
    maximum: Number(maximum.toFixed(3)),
    median: Number(median.toFixed(3)),
    p95: Number(p95.toFixed(3)),
    throughput: Number(throughput.toFixed(2)),
  };
}

module.exports = calculateMetrics;