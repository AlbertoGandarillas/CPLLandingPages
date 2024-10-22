import React, { useRef } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Upload } from "lucide-react";
interface FileAttachmentsProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  acceptedFileTypes?: string;
}
export const FileAttachments = ({ files, onFileChange, onRemoveFile, acceptedFileTypes }: FileAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
   const handleButtonClick = () => {
     fileInputRef.current?.click();
   };
  return (
    <div className="grid gap-y-2 py-4">
      <Label htmlFor="files">Attachments (optional)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="files"
          type="file"
          onChange={onFileChange}
          accept={acceptedFileTypes}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          type="button"
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Upload className="mr-2 h-4 w-4" /> Choose File
        </Button>
        <span className="text-sm text-gray-500">
          {files.length > 0
            ? `${files.length} file(s) selected`
            : "No file chosen"}
        </span>
      </div>
      {files.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Selected Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center space-x-2  bg-gray-100 p-2 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm pl-1">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
