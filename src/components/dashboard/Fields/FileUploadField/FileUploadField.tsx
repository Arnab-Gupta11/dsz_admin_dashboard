/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import { Label } from '@/components/ui/label';
import {
  useUploadImageMutation,
  useUploadPdfMutation,
  useUploadVideoMutation,
} from '@/redux/features/upload/upload.api';
import { FileIcon, ImageIcon, Loader2, X } from 'lucide-react';
import React, { useState, useId } from 'react';
import { toast } from 'sonner';

export type UploadType = 'image' | 'video' | 'pdf';

interface FileUploadFieldProps {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  value?: File | string | null;
  onChange: (fileOrUrl: File | string | null) => void;
  error?: string;
  required?: boolean;
  uploadType?: UploadType;
  accept?: string;
  autoUpload?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  subLabel,
  icon,
  value,
  onChange,
  error,
  required = false,
  uploadType = 'image',
  accept,
  autoUpload = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const uniqueId = useId();

  const previewUrl = React.useMemo(() => {
    if (!value) return null;
    if (value instanceof File) return URL.createObjectURL(value);
    return value;
  }, [value]);

  const [uploadImage] = useUploadImageMutation();
  const [uploadVideo] = useUploadVideoMutation();
  const [uploadPdf] = useUploadPdfMutation();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict file type validation based on uploadType
    let isValidType = true;
    if (uploadType === 'image' && !file.type.startsWith('image/')) {
      isValidType = false;
    } else if (uploadType === 'video' && !file.type.startsWith('video/')) {
      isValidType = false;
    } else if (uploadType === 'pdf' && file.type !== 'application/pdf') {
      isValidType = false;
    }

    if (!isValidType) {
      toast.error(`Invalid file type. Please upload a valid ${uploadType} file.`);
      e.target.value = '';
      return;
    }

    if (!autoUpload) {
      onChange(file);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      let res: any;
      if (uploadType === 'image') res = await uploadImage(formData).unwrap();
      else if (uploadType === 'video') res = await uploadVideo(formData).unwrap();
      else if (uploadType === 'pdf') res = await uploadPdf(formData).unwrap();

      const extractedUrl =
        typeof res?.data === 'string'
          ? res.data
          : res?.data?.url ||
            res?.data?.secureUrl ||
            res?.data?.data?.url ||
            res?.data?.fileUrl ||
            res?.data?.data?.fileUrl ||
            res?.url ||
            (typeof res === 'string' ? res : null);

      if (extractedUrl && typeof extractedUrl === 'string') {
        onChange(extractedUrl);
        toast.success(res?.message || res?.data?.message || 'File uploaded successfully!');
      } else {
        toast.error('Failed to retrieve file URL from response.');
        console.error('Upload Response:', res);
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        err?.data?.error?.details?.map((e: any) => `${e.field}: ${e.message}`).join(', ') ||
        err?.data?.errorSources?.map((e: any) => `${e.path}: ${e.message}`).join(', ') ||
        'Failed to upload file';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Determine accepted file types based on uploadType if accept is not provided
  const getAcceptType = () => {
    if (accept) return accept;
    if (uploadType === 'image') return 'image/jpeg,image/png,image/webp,image/gif';
    if (uploadType === 'video') return 'video/mp4,video/webm,video/quicktime';
    if (uploadType === 'pdf') return 'application/pdf';
    return '*/*';
  };

  // Determine default subLabel
  const getDefaultSubLabel = () => {
    if (subLabel) return subLabel;
    if (uploadType === 'image') return 'JPEG, PNG, WEBP, GIF up to 10MB';
    if (uploadType === 'video') return 'MP4, WEBM, MOV up to 100MB';
    if (uploadType === 'pdf') return 'PDF files only';
    return 'Max size 10MB';
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="block font-medium">
          {label} {required && <span className="text-danger">*</span>}
        </Label>
      )}

      <div className="relative">
        {!value ? (
          <div
            className={`focus-within:ring-primary/20 flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed p-10 transition-all duration-300 outline-none focus-within:ring-2 ${
              error
                ? 'border-danger/50 hover:border-danger bg-red-50/10'
                : 'hover:border-primary/60 border-border bg-muted hover:bg-card'
            } ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
            onClick={() => document.getElementById(`fileInput-${uniqueId}`)?.click()}
          >
            <div className="bg-primary/10 rounded-full p-3 shadow-none">
              {isUploading ? (
                <Loader2 className="text-primary h-5 w-5 animate-spin" />
              ) : icon ? (
                icon
              ) : uploadType === 'image' ? (
                <ImageIcon className="text-primary h-5 w-5" />
              ) : (
                <FileIcon className="text-primary h-5 w-5" />
              )}
            </div>

            <p className="text-primary-text mt-4 text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Click to upload '}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{getDefaultSubLabel()}</p>

            <input
              id={`fileInput-${uniqueId}`}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={getAcceptType()}
              disabled={isUploading}
            />
          </div>
        ) : (
          <div
            className={`group bg-muted relative h-52 w-full overflow-hidden rounded-sm border ${
              error ? 'border-danger/50' : 'border-border'
            }`}
          >
            {uploadType === 'image' ? (
              <img
                src={previewUrl as string}
                alt="Preview"
                className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            ) : uploadType === 'video' ? (
              <video
                src={previewUrl as string}
                controls
                className="h-full w-full object-contain p-2"
              />
            ) : uploadType === 'pdf' ? (
              <div className="text-primary flex h-full flex-col items-center justify-center">
                <FileIcon size={48} className="mb-2" />
                <span className="mb-2 text-sm font-medium">PDF File Selected</span>
                <a
                  href={previewUrl as string}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary/10 hover:bg-primary/20 rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                >
                  Click to View
                </a>
              </div>
            ) : (
              <div className="text-primary flex h-full flex-col items-center justify-center">
                <FileIcon size={48} className="mb-2" />
                <span className="text-sm font-medium">File Uploaded</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRemove}
              className="bg-danger absolute top-3 right-3 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-all hover:bg-red-600 active:scale-90"
              title="Remove file"
            >
              <X size={14} strokeWidth={2.5} />
            </button>

            <div className="bg-primary/80 absolute right-0 bottom-0 left-0 p-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Current File
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-danger text-xs font-medium">{error}</p>}
    </div>
  );
};

export default FileUploadField;
