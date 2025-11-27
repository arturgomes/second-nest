'use client';

import { FileUpload } from '@ark-ui/react';
import { UploadCloud, X, FileText } from 'lucide-react';

interface CsvFileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const CsvFileUpload = ({ onFileSelect, disabled }: CsvFileUploadProps) => {
  return (
    <FileUpload.Root
      maxFiles={1}
      accept={{ 'text/csv': ['.csv'] }}
      onFileChange={(details) => {
        if (details.acceptedFiles.length > 0) {
          onFileSelect(details.acceptedFiles[0]);
        }
      }}
      disabled={disabled}
      className="w-full"
    >
      <FileUpload.Dropzone className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
        <FileUpload.Label className="flex flex-col items-center gap-2 cursor-pointer">
          <UploadCloud className="w-10 h-10 text-gray-400" />
          <span className="text-lg font-medium text-gray-700">
            Drag & drop your CSV here
          </span>
          <span className="text-sm text-gray-500">or click to browse</span>
        </FileUpload.Label>
      </FileUpload.Dropzone>

      <FileUpload.ItemGroup className="mt-4 space-y-2">
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item
                key={file.name}
                file={file}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex flex-col">
                    <FileUpload.ItemName className="text-sm font-medium text-gray-900" />
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <FileUpload.ItemDeleteTrigger className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <X className="w-4 h-4" />
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
};
