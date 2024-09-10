import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewCPLCommonQualifications } from '@prisma/client';
import SkeletonWrapper from '../shared/SkeletonWrapper';
interface IndustryCertificationsTableProps {
    data: ViewCPLCommonQualifications[];
    onRowClick: (industryCertification: string) => void;
    loading: boolean;
    error: Error | null;
    }

export default function CertificationsTable({data, onRowClick, loading, error}: IndustryCertificationsTableProps) {
  return (
    <>
      {error && <p>Error: {error.message}</p>}
      <SkeletonWrapper isLoading={loading} fullWidth={true} variant="table">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading &&
              !error &&
              data &&
              data.map((ic, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="flex items-center cursor-pointer gap-1"
                    onClick={() => onRowClick(ic.IndustryCertification)}
                  >
                    {ic.IndustryCertification}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </SkeletonWrapper>
    </>
  );
}
