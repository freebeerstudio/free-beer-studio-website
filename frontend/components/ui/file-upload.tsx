import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface FileUploadProps {
  onFileUploaded: (url: string, fileId: string) => void;
  onFileRemoved?: () => void;
  currentUrl?: string;
  category: 'pricing' | 'project' | 'blog' | 'profile' | 'styleguide';
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export default function FileUpload({
  onFileUploaded,
  onFileRemoved,
  currentUrl,
  category,
  accept = 'image/*',
  multiple = false,
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    
    try {
      const file = files[0]; // For now, handle single file upload
      
      // Step 1: Get signed upload URL
      const uploadResponse = await backend.uploads.getUploadUrl({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        category,
      });

      console.log('Upload URL received:', uploadResponse);

      // Step 2: Upload file directly to object storage using fetch
      const uploadResult = await fetch(uploadResponse.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      console.log('Upload result status:', uploadResult.status);

      if (!uploadResult.ok) {
        const errorText = await uploadResult.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Failed to upload file to storage: ${uploadResult.status} ${uploadResult.statusText}`);
      }

      // Step 3: Confirm upload completion
      const confirmResponse = await backend.uploads.confirmUpload({
        fileId: uploadResponse.fileId,
        size: file.size,
      });

      console.log('Upload confirmed:', confirmResponse);

      onFileUploaded(confirmResponse.url, confirmResponse.id);
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleRemove = () => {
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const isImage = currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.jpeg') || currentUrl.includes('.png') || currentUrl.includes('.gif') || currentUrl.includes('.webp'));

  return (
    <div className={`space-y-2 ${className}`}>
      {currentUrl ? (
        <div className="relative">
          {isImage ? (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
              <img
                src={currentUrl}
                alt="Uploaded file"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
              <div className="flex items-center space-x-2">
                <File className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">File uploaded</span>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-muted-foreground">
                {accept.includes('image') ? (
                  <ImageIcon className="w-full h-full" />
                ) : (
                  <Upload className="w-full h-full" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept === 'image/*' ? 'Images only' : 'All file types'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}