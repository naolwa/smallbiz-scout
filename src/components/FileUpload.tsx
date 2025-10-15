import { useState, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { SampleDataGenerator } from './SampleDataGenerator';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          onDataLoaded(results.data);
          toast({
            title: 'File uploaded successfully',
            description: `Loaded ${results.data.length} rows of data`,
          });
        } else {
          toast({
            title: 'Empty file',
            description: 'The CSV file contains no data',
            variant: 'destructive',
          });
        }
      },
      error: (error) => {
        toast({
          title: 'Parse error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  }, [onDataLoaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 ${
        isDragging 
          ? 'border-primary bg-primary/5 shadow-glow' 
          : 'border-border hover:border-primary/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-12 text-center">
        {fileName ? (
          <div className="flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 text-primary" />
            <div>
              <p className="text-lg font-semibold text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">File loaded successfully</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setFileName(null);
                onDataLoaded([]);
              }}
            >
              Upload Different File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Your Business Data
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
            </div>
            <Button asChild>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileInput}
                />
                Choose File
              </label>
            </Button>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                Expected columns: month, sales, expenses, profit, customers, marketing_spend
              </p>
              <SampleDataGenerator />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
