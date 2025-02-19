"use client";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiFile, FiX } from "react-icons/fi";

export const FileUpload = ({ 
  onChange 
}: { 
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    onChange?.(acceptedFiles);
  }, [onChange]);

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${isDragActive 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-gray-800 hover:border-gray-700 dark:border-gray-700 dark:hover:border-gray-600"}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 rounded-full bg-gray-900/50 p-3"
          >
            <FiUpload className="h-6 w-6 text-gray-400" />
          </motion.div>
          <p className="text-sm text-gray-400">
            {isDragActive ? (
              "Drop files here"
            ) : (
              <>
                Drag & drop files here, or{" "}
                <span className="text-white underline decoration-dotted underline-offset-2">
                  click to select
                </span>
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: PDF, PNG, JPG
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-800 p-2">
                    <FiFile className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="rounded-full p-1 hover:bg-gray-800 transition-colors group"
                >
                  <FiX className="h-4 w-4 text-gray-500 group-hover:text-red-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
