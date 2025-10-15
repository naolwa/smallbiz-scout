import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BusinessData } from '@/lib/ml-utils';

interface DataPreviewProps {
  data: BusinessData[];
}

export const DataPreview = ({ data }: DataPreviewProps) => {
  const previewData = data.slice(0, 5);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Data Preview ({data.length} rows total)
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">Marketing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">
                    ${row.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${row.expenses.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${row.profit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.customers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${row.marketing_spend.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.length > 5 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing first 5 of {data.length} rows
          </p>
        )}
      </div>
    </Card>
  );
};
