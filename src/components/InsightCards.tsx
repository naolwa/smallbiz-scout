import { Card } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Insight } from '@/lib/ml-utils';

interface InsightCardsProps {
  insights: Insight[];
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-green-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

const bgMap = {
  success: 'bg-green-50 dark:bg-green-950/20',
  warning: 'bg-amber-50 dark:bg-amber-950/20',
  info: 'bg-blue-50 dark:bg-blue-950/20',
};

export const InsightCards = ({ insights }: InsightCardsProps) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          AI-Generated Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, idx) => {
            const Icon = iconMap[insight.type];
            return (
              <div 
                key={idx}
                className={`p-4 rounded-lg border border-border ${bgMap[insight.type]}`}
              >
                <div className="flex gap-3">
                  <Icon className={`w-5 h-5 ${colorMap[insight.type]} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
