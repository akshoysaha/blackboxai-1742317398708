import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface FilePreviewProps {
  url: string;
  name: string;
  type: string;
  size: number;
  onDownload?: () => void;
}

export default function FilePreview({
  url,
  name,
  type,
  size,
  onDownload,
}: FilePreviewProps) {
  const theme = useTheme();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getFileIcon = () => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('pdf') || type.includes('document')) return <DocumentIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handlePreview = () => {
    if (type.startsWith('image/') || type.startsWith('video/') || type.startsWith('audio/')) {
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = async () => {
    if (!onDownload) {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onDownload();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'action.selected',
            color: 'primary.main',
          }}
        >
          {getFileIcon()}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(size)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {(type.startsWith('image/') || type.startsWith('video/') || type.startsWith('audio/')) && (
            <IconButton
              size="small"
              onClick={handlePreview}
              sx={{ color: 'primary.main' }}
            >
              <ZoomInIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={handleDownload}
            disabled={isLoading}
            sx={{ color: 'primary.main' }}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <DownloadIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setIsPreviewOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {type.startsWith('image/') && (
            <Box
              component="img"
              src={url}
              alt={name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}

          {type.startsWith('video/') && (
            <Box
              component="video"
              src={url}
              controls
              sx={{
                width: '100%',
                maxHeight: '80vh',
              }}
            />
          )}

          {type.startsWith('audio/') && (
            <Box
              component="audio"
              src={url}
              controls
              sx={{
                width: '100%',
                mt: 2,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}