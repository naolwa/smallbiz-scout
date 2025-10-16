import { Card } from '@/components/ui/card';
import { BusinessData } from '@/lib/ml-utils';
import { useMemo } from 'react';

interface CorrelationMatrixProps {
  data: BusinessData[];
}

const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const CorrelationMatrix = ({ data }: CorrelationMatrixProps) => {
  const correlations = useMemo(() => {
    const features = ['sales', 'expenses', 'profit', 'customers', 'marketing_spend'] as const;
    const matrix: Record<string, Record<string, number>> = {};

    features.forEach(feature1 => {
      matrix[feature1] = {};
      features.forEach(feature2 => {
        const x = data.map(d => d[feature1]);
        const y = data.map(d => d[feature2]);
        matrix[feature1][feature2] = calculateCorrelation(x, y);
      });
    });

    return matrix;
  }, [data]);

  const getColorClass = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return 'bg-primary text-primary-foreground';
    if (absValue > 0.4) return 'bg-secondary text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const features = ['sales', 'expenses', 'profit', 'customers', 'marketing_spend'];
  const featureLabels = {
    sales: 'Sales',
    expenses: 'Expenses',
    profit: 'Profit',
    customers: 'Customers',
    marketing_spend: 'Marketing',
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Feature Correlation Matrix
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Shows relationships between different business metrics (-1 to 1)
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-xs font-medium text-muted-foreground"></th>
              {features.map(feature => (
                <th key={feature} className="p-2 text-xs font-medium text-muted-foreground">
                  {featureLabels[feature as keyof typeof featureLabels]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feature1 => (
              <tr key={feature1}>
                <td className="p-2 text-xs font-medium text-muted-foreground">
                  {featureLabels[feature1 as keyof typeof featureLabels]}
                </td>
                {features.map(feature2 => {
                  const value = correlations[feature1][feature2];
                  return (
                    <td key={feature2} className="p-1">
                      <div
                        className={`text-center rounded px-2 py-1 text-xs font-semibold ${getColorClass(value)}`}
                        title={`Correlation: ${value.toFixed(3)}`}
                      >
                        {value.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span>Strong (|r| {'>'} 0.7)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-secondary"></div>
          <span>Moderate (|r| {'>'} 0.4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-muted"></div>
          <span>Weak (|r| ≤ 0.4)</span>
        </div>
      </div>
    </Card>
  );
};
