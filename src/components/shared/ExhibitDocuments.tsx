"use client";
import React, { useState } from "react";
import { useExhibitDocuments } from "../../hooks/useExhibitDocuments";
import { CPLExhibitDocuments } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExhibitDocumentsProps {
  exhibitId: string;
}

export function ExhibitDocumentsTable({ exhibitId }: ExhibitDocumentsProps) {
  const { data: documents, isLoading, error } = useExhibitDocuments(exhibitId);
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async (doc: CPLExhibitDocuments) => {
    try {
      const response = await fetch(
        `/api/download-document/${doc.id}`
      );

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.FileName || 'document';
      window.document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileExtension = (filename: string | null) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() : '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading documents
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Exhibit Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {(!documents || documents.length === 0) ? (
          <p className="text-center text-muted-foreground">
            No documents available.
          </p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.FileName}</p>
                    <div className="flex space-x-2 text-sm text-muted-foreground">
                      <span>{getFileExtension(doc.FileName)}</span>
                      <span>•</span>
                      <span>Added on {formatDate(doc.CreatedOn)}</span>
                      {doc.FileDescription && (
                        <>
                          <span>•</span>
                          <span>{doc.FileDescription}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="flex items-center space-x-2"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4" />
                      <span>Download</span>
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
