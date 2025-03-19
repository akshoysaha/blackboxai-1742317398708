import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';

interface CreateRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, isDirect: boolean, invitees: string[]) => Promise<void>;
}

export default function CreateRoomDialog({
  open,
  onClose,
  onSubmit,
}: CreateRoomDialogProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [isDirect, setIsDirect] = useState(false);
  const [invitee, setInvitee] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      if (!name.trim()) {
        throw new Error('Room name is required');
      }

      if (isDirect && invitees.length === 0) {
        throw new Error('Please add at least one user to direct message');
      }

      await onSubmit(name.trim(), isDirect, invitees);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setIsDirect(false);
    setInvitee('');
    setInvitees([]);
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleAddInvitee = () => {
    if (invitee.trim() && !invitees.includes(invitee.trim())) {
      setInvitees([...invitees, invitee.trim()]);
      setInvitee('');
    }
  };

  const handleRemoveInvitee = (inviteeToRemove: string) => {
    setInvitees(invitees.filter(i => i !== inviteeToRemove));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New {isDirect ? 'Direct Message' : 'Room'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={isDirect}
                onChange={(e) => setIsDirect(e.target.checked)}
              />
            }
            label="Direct Message"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Invite Users
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="User ID"
                value={invitee}
                onChange={(e) => setInvitee(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInvitee();
                  }
                }}
                fullWidth
                size="small"
                placeholder="@user:domain.com"
              />
              <Button
                onClick={handleAddInvitee}
                variant="outlined"
                sx={{ minWidth: '80px' }}
              >
                Add
              </Button>
            </Box>
            {invitees.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {invitees.map((inv) => (
                  <Chip
                    key={inv}
                    label={inv}
                    onDelete={() => handleRemoveInvitee(inv)}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}