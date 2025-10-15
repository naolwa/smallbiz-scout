import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const SampleDataGenerator = () => {
  const generateSampleCSV = () => {
    const sampleData = [
      ['month', 'sales', 'expenses', 'profit', 'customers', 'marketing_spend'],
      ['Jan 2024', '45000', '28000', '17000', '120', '5000'],
      ['Feb 2024', '48000', '29000', '19000', '135', '5200'],
      ['Mar 2024', '52000', '30000', '22000', '145', '5500'],
      ['Apr 2024', '49000', '28500', '20500', '140', '5300'],
      ['May 2024', '55000', '31000', '24000', '160', '6000'],
      ['Jun 2024', '58000', '32000', '26000', '175', '6200'],
      ['Jul 2024', '61000', '33000', '28000', '190', '6500'],
      ['Aug 2024', '59000', '32500', '26500', '185', '6300'],
      ['Sep 2024', '64000', '34000', '30000', '200', '6800'],
      ['Oct 2024', '67000', '35000', '32000', '215', '7000'],
      ['Nov 2024', '70000', '36000', '34000', '230', '7200'],
      ['Dec 2024', '75000', '37000', '38000', '250', '7500'],
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-business-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={generateSampleCSV} className="gap-2">
      <Download className="w-4 h-4" />
      Download Sample Data
    </Button>
  );
};
