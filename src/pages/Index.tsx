import { useState, useMemo } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { ClusterVisualization } from '@/components/ClusterVisualization';
import { ForecastChart } from '@/components/ForecastChart';
import { InsightCards } from '@/components/InsightCards';
import { EthicsSection } from '@/components/EthicsSection';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Brain } from 'lucide-react';
import {
  cleanData,
  performClustering,
  performForecasting,
  generateInsights,
  type BusinessData,
} from '@/lib/ml-utils';

const Index = () => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<BusinessData[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleDataLoaded = (data: any[]) => {
    setRawData(data);
    const cleaned = cleanData(data);
    setProcessedData(cleaned);
    setShowAnalysis(false);
  };

  const clusters = useMemo(() => {
    if (!showAnalysis || processedData.length === 0) return [];
    return performClustering(processedData, 3);
  }, [processedData, showAnalysis]);

  const forecast = useMemo(() => {
    if (!showAnalysis || processedData.length === 0) return [];
    return performForecasting(processedData, 'sales', 6);
  }, [processedData, showAnalysis]);

  const insights = useMemo(() => {
    if (!showAnalysis || processedData.length === 0 || clusters.length === 0) return [];
    return generateInsights(processedData, clusters);
  }, [processedData, clusters, showAnalysis]);

  const handleAnalyze = () => {
    if (processedData.length < 3) {
      return;
    }
    setShowAnalysis(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Business Insights
              </h1>
              <p className="text-sm text-muted-foreground">
                Data-driven decisions for small enterprises
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {processedData.length === 0 && (
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Transform Your Business Data into Actionable Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your business performance data and let AI identify patterns, 
              forecast trends, and generate actionable recommendations.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onDataLoaded={handleDataLoaded} />
        </div>

        {/* Data Preview & Analysis */}
        {processedData.length > 0 && (
          <>
            <div className="mb-8">
              <DataPreview data={processedData} />
            </div>

            {!showAnalysis && (
              <div className="mb-8 text-center">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={processedData.length < 3}
                  className="gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Analyze Data with AI
                </Button>
                {processedData.length < 3 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Need at least 3 data points for analysis
                  </p>
                )}
              </div>
            )}

            {showAnalysis && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Insights */}
                {insights.length > 0 && (
                  <div>
                    <InsightCards insights={insights} />
                  </div>
                )}

                {/* Clustering */}
                {clusters.length > 0 && (
                  <div>
                    <ClusterVisualization clusters={clusters} />
                  </div>
                )}

                {/* Forecast */}
                {forecast.length > 0 && (
                  <div>
                    <ForecastChart forecast={forecast} />
                  </div>
                )}

                {/* Ethics Section */}
                <div>
                  <EthicsSection />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalysis(false)}
                  >
                    Hide Analysis
                  </Button>
                  <Button
                    onClick={() => {
                      setRawData([]);
                      setProcessedData([]);
                      setShowAnalysis(false);
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze New Data
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Built with machine learning • K-Means Clustering • Linear Regression
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All processing happens locally in your browser. Your data never leaves your device.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
