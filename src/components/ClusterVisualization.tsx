import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ClusterResult } from '@/lib/ml-utils';

interface ClusterVisualizationProps {
  clusters: ClusterResult[];
}

const CLUSTER_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export const ClusterVisualization = ({ clusters }: ClusterVisualizationProps) => {
  const clusterStats = clusters.reduce((acc, c) => {
    if (!acc[c.cluster]) {
      acc[c.cluster] = { count: 0, avgSales: 0, avgProfit: 0 };
    }
    acc[c.cluster].count++;
    acc[c.cluster].avgSales += c.sales;
    acc[c.cluster].avgProfit += c.profit;
    return acc;
  }, {} as Record<number, { count: number; avgSales: number; avgProfit: number }>);

  Object.keys(clusterStats).forEach(key => {
    const cluster = clusterStats[Number(key)];
    cluster.avgSales /= cluster.count;
    cluster.avgProfit /= cluster.count;
  });

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Performance Pattern Analysis
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI-detected {Object.keys(clusterStats).length} distinct business performance patterns
        </p>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="sales" 
                name="Sales" 
                unit="$"
                stroke="hsl(var(--foreground))"
              />
              <YAxis 
                type="number" 
                dataKey="profit" 
                name="Profit" 
                unit="$"
                stroke="hsl(var(--foreground))"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Scatter 
                name="Business Performance" 
                data={clusters} 
                fill="hsl(var(--primary))"
              >
                {clusters.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(clusterStats).map(([cluster, stats]) => (
            <div 
              key={cluster}
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: CLUSTER_COLORS[Number(cluster)] }}
                />
                <h4 className="font-semibold text-sm text-foreground">
                  Pattern {Number(cluster) + 1}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.count} data points
              </p>
              <p className="text-xs text-muted-foreground">
                Avg Sales: ${stats.avgSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg Profit: ${stats.avgProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
