import { Card } from '@/components/ui/card';
import { RegressionMetrics as MetricsType } from '@/lib/ml-utils';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RegressionMetricsProps {
  metrics: MetricsType;
}

export const RegressionMetrics = ({ metrics }: RegressionMetricsProps) => {
  const getR2Quality = (r2: number) => {
    if (r2 >= 0.7) return { label: 'Strong Fit', color: 'text-green-600 dark:text-green-400' };
    if (r2 >= 0.4) return { label: 'Moderate Fit', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Weak Fit', color: 'text-red-600 dark:text-red-400' };
  };

  const r2Quality = getR2Quality(metrics.rSquared);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Regression Model Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* R-Squared */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-muted/30 rounded-lg cursor-help">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">R² Score</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {metrics.rSquared.toFixed(3)}
                </div>
                <div className={`text-xs font-medium mt-1 ${r2Quality.color}`}>
                  {r2Quality.label}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                R² measures how well the model fits the data. Values closer to 1.0 indicate better predictions.
                Your score of {(metrics.rSquared * 100).toFixed(1)}% means the model explains that percentage of variance in the data.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Slope */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-muted/30 rounded-lg cursor-help">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Growth Rate</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  ${metrics.slope.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  per month
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                The average change in sales per month. 
                {metrics.slope > 0 ? ' A positive value indicates growth.' : ' A negative value indicates decline.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Intercept */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-muted/30 rounded-lg cursor-help">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Baseline</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  ${metrics.intercept.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  starting point
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                The predicted value at month zero (baseline). This represents your business's starting performance level.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Model Equation:</strong> Sales = ${metrics.intercept.toFixed(2)} + (${metrics.slope.toFixed(2)} × Month)
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          This linear regression model predicts future sales based on historical trends. 
          Higher R² values indicate more reliable predictions.
        </p>
      </div>
    </Card>
  );
};
