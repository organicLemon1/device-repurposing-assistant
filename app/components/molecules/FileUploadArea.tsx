'use client';

import React, { useState, useRef } from 'react';
import { CloudUploadIcon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface FileUploadAreaProps {
  onFileChange: (file: File | null) => void;
  error?: string;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileChange, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    setLocalError(null);
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
      setLocalError("Only JPG, JPEG, and PNG files are allowed.");
      return false;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setLocalError("File size must be 2MB or less.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileChange(selectedFile);
      }
    } else {
      setFile(null);
      onFileChange(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileChange(droppedFile);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    onFileChange(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-3">
      <div 
        className="flex items-center justify-between w-full border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 bg-white dark:bg-[#1b1c23] shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-[#1f2029]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-full text-indigo-600 dark:text-slate-300 flex-shrink-0">
            <CloudUploadIcon />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0 mr-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate title" title={file ? file.name : ""}>
              {file ? file.name : "Drag and drop file here"}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mt-1">Limit 2MB per file • JPG, PNG, JPEG</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {file && (
            <Button type="button" variant="outline" className="px-3 whitespace-nowrap" onClick={clearFile}>
              Clear
            </Button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/jpg" 
            onChange={handleFileChange}
          />
          <Button type="button" variant="secondary" className="px-5 whitespace-nowrap" onClick={() => fileInputRef.current?.click()}>
            Browse files
          </Button>
        </div>
      </div>
      {(localError || error) && <p className="text-red-400 text-sm mt-2 ml-1">{localError || error}</p>}
    </div>
  );
};
