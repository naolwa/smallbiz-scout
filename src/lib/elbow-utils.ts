// Elbow Method for optimal K determination
import { BusinessData, ElbowPoint } from './ml-utils';

const simpleKMeans = (points: number[][], k: number) => {
  const centroids: number[][] = [];
  const usedIndices = new Set<number>();
  
  while (centroids.length < k) {
    const randomIndex = Math.floor(Math.random() * points.length);
    if (!usedIndices.has(randomIndex)) {
      centroids.push([...points[randomIndex]]);
      usedIndices.add(randomIndex);
    }
  }
  
  let clusters: number[] = new Array(points.length).fill(0);
  let changed = true;
  let iterations = 0;
  const maxIterations = 100;
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    for (let i = 0; i < points.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const dist = Math.sqrt(
          Math.pow(points[i][0] - centroids[j][0], 2) +
          Math.pow(points[i][1] - centroids[j][1], 2)
        );
        
        if (dist < minDist) {
          minDist = dist;
          bestCluster = j;
        }
      }
      
      if (clusters[i] !== bestCluster) {
        clusters[i] = bestCluster;
        changed = true;
      }
    }
    
    for (let j = 0; j < k; j++) {
      const clusterPoints = points.filter((_, i) => clusters[i] === j);
      if (clusterPoints.length > 0) {
        centroids[j] = [
          clusterPoints.reduce((sum, p) => sum + p[0], 0) / clusterPoints.length,
          clusterPoints.reduce((sum, p) => sum + p[1], 0) / clusterPoints.length,
        ];
      }
    }
  }
  
  return { clusters, centroids };
};

const calculateInertia = (points: number[][], clusters: number[], centroids: number[][]): number => {
  let inertia = 0;
  
  for (let i = 0; i < points.length; i++) {
    const clusterIdx = clusters[i];
    const centroid = centroids[clusterIdx];
    const dist = Math.sqrt(
      Math.pow(points[i][0] - centroid[0], 2) +
      Math.pow(points[i][1] - centroid[1], 2)
    );
    inertia += dist * dist;
  }
  
  return inertia;
};

export const calculateElbowPoints = (data: BusinessData[], maxK: number = 8): ElbowPoint[] => {
  const points = data.map(d => [d.sales, d.profit]);
  const results: ElbowPoint[] = [];
  
  const actualMaxK = Math.min(maxK, data.length);
  
  for (let k = 1; k <= actualMaxK; k++) {
    const { clusters, centroids } = simpleKMeans(points, k);
    const inertia = calculateInertia(points, clusters, centroids);
    results.push({ k, inertia });
  }
  
  return results;
};
