import { Card } from '@/components/ui/card';
import { Shield, Eye, Scale } from 'lucide-react';

export const EthicsSection = () => {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Ethical AI Considerations
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI-powered insights are designed to assist your decision-making, not replace human judgment.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Eye className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">
                Transparency
              </h4>
              <p className="text-xs text-muted-foreground">
                All predictions use explainable algorithms (K-Means clustering and Linear Regression). 
                We show you how patterns are detected and forecasts are calculated.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Scale className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">
                Fairness & Accuracy
              </h4>
              <p className="text-xs text-muted-foreground">
                Models are trained solely on your business data. Results reflect historical patterns 
                and should be validated against current market conditions and strategic goals.
              </p>
            </div>
          </div>

          <div className="p-3 bg-card rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Data Privacy:</strong> Your data is processed locally 
              in your browser. No information is sent to external servers or stored remotely.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
