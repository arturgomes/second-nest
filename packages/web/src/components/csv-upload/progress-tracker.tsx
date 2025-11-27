'use client';

import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportProgressProps {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processed: number;
  total: number;
  errors: number;
}

export const ImportProgress = ({ status, processed, total, errors }: ImportProgressProps) => {
  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {status === 'PROCESSING' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
          {status === 'COMPLETED' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === 'FAILED' && <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-medium text-gray-900">
            {status === 'PENDING' && 'Waiting to start...'}
            {status === 'PROCESSING' && 'Processing records...'}
            {status === 'COMPLETED' && 'Import Completed'}
            {status === 'FAILED' && 'Import Failed'}
          </span>
        </div>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${status === 'FAILED' ? 'bg-red-500' : 'bg-blue-600'
            }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Processed: {processed}</span>
        {errors > 0 && <span className="text-red-600 font-medium">Errors: {errors}</span>}
        {total > 0 && <span>Total: {total}</span>}
      </div>
    </div>
  );
};
