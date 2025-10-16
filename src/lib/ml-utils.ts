// Machine Learning Utilities
import { SimpleLinearRegression } from 'ml-regression';

export interface BusinessData {
  month: string;
  sales: number;
  expenses: number;
  profit: number;
  customers: number;
  marketing_spend: number;
}

export interface ClusterResult {
  cluster: number;
  sales: number;
  profit: number;
  centroidSales: number;
  centroidProfit: number;
}

export interface ForecastResult {
  month: string;
  actual?: number;
  predicted: number;
}

export interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface RegressionMetrics {
  rSquared: number;
  slope: number;
  intercept: number;
}

export interface ElbowPoint {
  k: number;
  inertia: number;
}

// Simple K-Means implementation
const simpleKMeans = (points: number[][], k: number) => {
  // Initialize centroids randomly from existing points
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
    
    // Assign points to nearest centroid
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
    
    // Update centroids
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

// Clean and validate data with improved missing value handling
export const cleanData = (data: any[]): BusinessData[] => {
  // Calculate mean values for imputation
  const calculateMean = (key: string) => {
    const validValues = data
      .map(row => parseFloat(row[key]))
      .filter(val => !isNaN(val) && val !== null && val !== undefined);
    return validValues.length > 0 
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length 
      : 0;
  };

  const means = {
    sales: calculateMean('sales'),
    expenses: calculateMean('expenses'),
    profit: calculateMean('profit'),
    customers: calculateMean('customers'),
    marketing_spend: calculateMean('marketing_spend'),
  };

  return data
    .filter(row => row.month) // Only require month to be present
    .map(row => ({
      month: String(row.month),
      sales: parseFloat(row.sales) || means.sales,
      expenses: parseFloat(row.expenses) || means.expenses,
      profit: parseFloat(row.profit) || means.profit,
      customers: parseFloat(row.customers) || means.customers,
      marketing_spend: parseFloat(row.marketing_spend) || means.marketing_spend,
    }));
};

// Perform K-Means clustering
export const performClustering = (data: BusinessData[], k: number = 3): ClusterResult[] => {
  if (data.length < k) {
    k = Math.max(1, data.length);
  }

  // Prepare data for clustering (sales and profit)
  const points = data.map(d => [d.sales, d.profit]);
  
  const result = simpleKMeans(points, k);
  
  return data.map((d, i) => ({
    cluster: result.clusters[i],
    sales: d.sales,
    profit: d.profit,
    centroidSales: result.centroids[result.clusters[i]][0],
    centroidProfit: result.centroids[result.clusters[i]][1],
  }));
};

// Perform linear regression for forecasting
export const performForecasting = (
  data: BusinessData[], 
  metric: 'sales' | 'profit' = 'sales',
  monthsAhead: number = 6
): { forecast: ForecastResult[], metrics: RegressionMetrics } => {
  // Create x values (month index) and y values (metric)
  const x = data.map((_, i) => i);
  const y = data.map(d => d[metric]);
  
  const regression = new SimpleLinearRegression(x, y);
  
  // Calculate R-squared
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;
  const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - regression.predict(i), 2), 0);
  const rSquared = 1 - (ssRes / ssTot);
  
  // Generate forecast
  const results: ForecastResult[] = [];
  
  // Add historical data
  data.forEach((d, i) => {
    results.push({
      month: d.month,
      actual: d[metric],
      predicted: regression.predict(i),
    });
  });
  
  // Add future predictions
  for (let i = 0; i < monthsAhead; i++) {
    const futureIndex = data.length + i;
    const futureMonth = `Month ${futureIndex + 1}`;
    results.push({
      month: futureMonth,
      predicted: regression.predict(futureIndex),
    });
  }
  
  return {
    forecast: results,
    metrics: {
      rSquared: Math.max(0, Math.min(1, rSquared)),
      slope: regression.slope,
      intercept: regression.intercept,
    }
  };
};

// Generate business insights
export const generateInsights = (data: BusinessData[], clusters: ClusterResult[]): Insight[] => {
  const insights: Insight[] = [];
  
  // Calculate averages
  const avgProfit = data.reduce((sum, d) => sum + d.profit, 0) / data.length;
  const avgProfitMargin = data.reduce((sum, d) => sum + (d.profit / d.sales) * 100, 0) / data.length;
  const avgExpenseRatio = data.reduce((sum, d) => sum + (d.expenses / d.sales) * 100, 0) / data.length;
  
  // Profit margin insight
  if (avgProfitMargin > 20) {
    insights.push({
      type: 'success',
      title: 'Healthy Profit Margin',
      description: `Your average profit margin of ${avgProfitMargin.toFixed(1)}% indicates strong financial health.`,
    });
  } else if (avgProfitMargin < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Profit Margin',
      description: `Your average profit margin of ${avgProfitMargin.toFixed(1)}% is below industry standards. Consider cost optimization.`,
    });
  }
  
  // Expense ratio insight
  if (avgExpenseRatio > 70) {
    insights.push({
      type: 'warning',
      title: 'High Operating Expenses',
      description: `Expenses represent ${avgExpenseRatio.toFixed(1)}% of sales. Look for cost-saving opportunities.`,
    });
  } else if (avgExpenseRatio < 50) {
    insights.push({
      type: 'success',
      title: 'Efficient Operations',
      description: `Well-controlled expenses at ${avgExpenseRatio.toFixed(1)}% of sales demonstrate operational efficiency.`,
    });
  }
  
  // Trend insight
  const recentProfit = data.slice(-3).reduce((sum, d) => sum + d.profit, 0) / 3;
  const olderProfit = data.slice(0, 3).reduce((sum, d) => sum + d.profit, 0) / 3;
  
  if (recentProfit > olderProfit * 1.2) {
    insights.push({
      type: 'success',
      title: 'Positive Growth Trend',
      description: 'Your recent performance shows strong improvement compared to earlier periods.',
    });
  } else if (recentProfit < olderProfit * 0.8) {
    insights.push({
      type: 'warning',
      title: 'Declining Performance',
      description: 'Recent data shows a downward trend. Review your strategy and market conditions.',
    });
  }
  
  // Cluster insight
  const uniqueClusters = new Set(clusters.map(c => c.cluster)).size;
  insights.push({
    type: 'info',
    title: 'Performance Patterns Detected',
    description: `AI identified ${uniqueClusters} distinct performance patterns in your business data.`,
  });
  
  return insights;
};
