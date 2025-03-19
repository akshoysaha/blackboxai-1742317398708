import { useRef, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export default function FileUpload({
  onUpload,
  accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt',
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
}: FileUploadProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File size exceeds ${formatBytes(maxSize)}`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          height: 200,
          border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: isDragging ? 'action.hover' : 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: theme.palette.primary.main,
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <CircularProgress size={40} />
        ) : (
          <>
            <UploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">
              Drag & drop files here or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: {formatBytes(maxSize)}
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main',
            bgcolor: 'error.light',
            p: 1,
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>
            {error}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setError(null)}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}