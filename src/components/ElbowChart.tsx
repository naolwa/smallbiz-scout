import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { ElbowPoint } from '@/lib/ml-utils';
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ElbowChartProps {
  elbowPoints: ElbowPoint[];
  optimalK: number;
}

export const ElbowChart = ({ elbowPoints, optimalK }: ElbowChartProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            Optimal Cluster Selection (Elbow Method)
          </h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  The elbow method helps determine the optimal number of clusters by finding where adding more clusters provides diminishing returns.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Optimal number of clusters: <span className="font-semibold">{optimalK}</span>
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={elbowPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="k" 
                stroke="hsl(var(--foreground))"
                label={{ value: 'Number of Clusters (k)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                label={{ value: 'Inertia', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="inertia" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <ReferenceDot 
                x={optimalK} 
                y={elbowPoints.find(p => p.k === optimalK)?.inertia || 0} 
                r={6} 
                fill="hsl(var(--accent))" 
                stroke="hsl(var(--accent))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
