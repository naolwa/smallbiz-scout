import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ForecastResult } from '@/lib/ml-utils';

interface ForecastChartProps {
  forecast: ForecastResult[];
}

export const ForecastChart = ({ forecast }: ForecastChartProps) => {
  const historicalCount = forecast.filter(f => f.actual !== undefined).length;

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Sales Forecast (6 Months Ahead)
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Linear regression model predicting future performance based on historical trends
        </p>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--foreground))"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <ReferenceLine 
                x={forecast[historicalCount - 1]?.month} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3"
                label={{ value: 'Forecast Start', position: 'top', fontSize: 12 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Actual Sales"
                dot={{ fill: 'hsl(var(--primary))' }}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted Sales"
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This forecast uses linear regression based on historical data. 
            Predictions should be validated against market conditions and business strategy.
          </p>
        </div>
      </div>
    </Card>
  );
};
