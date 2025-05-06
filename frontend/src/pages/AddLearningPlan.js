
import { useState } from 'react';
import {
  TextField, Button, Typography, MenuItem,
  FormControl, InputLabel, Select, Paper, Box, Grid, Divider
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { toast } from 'react-toastify';
import axios from '../api/axiosConfig';

export default function AddLearningPlan({ onClose, onPlanCreated }) {
  const [form, setForm] = useState({
    title: '',
    topics: '',
    resources: '',
    targetDate: '',
    progress: 'Not Started'
  });

  const handleSubmit = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (!form.title || !form.topics || !form.resources || !form.targetDate) {
      toast.error('Please fill out all fields');
      return;
    }
    if (form.targetDate < today) {
      toast.error('Target date cannot be in the past.');
      return;
    }

    try {
      await axios.post('/learning-plans', {
        ...form,
        topics: form.topics.split(',').map(t => t.trim()),
        resources: form.resources.split(',').map(r => r.trim())
      });
      toast.success('Learning plan created!');
      onClose();
      onPlanCreated();
    } catch {
      toast.error('Failed to add plan!');
    }
  };

  return (
    <Paper sx={{
      p: 4,
      borderRadius: 4,
      backgroundColor: '#fff',
      border: '1px solid #DBDBDB'
    }}>
      <Box display="flex" alignItems="center" mb={3}>
        <BookmarkAddIcon sx={{ fontSize: 32, mr: 2, color: '#262626' }} />
        <Typography variant="h5" fontWeight="bold" color="#000">
          Create Learning Plan
        </Typography>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#DBDBDB' }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Plan Title"
            fullWidth
            variant="outlined"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{
              '& .MuiInputLabel-root.Mui-focused': { color: '#262626' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#262626' },
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Topics"
            fullWidth
            variant="outlined"
            placeholder="Comma-separated (e.g., HTML, CSS)"
            value={form.topics}
            onChange={(e) => setForm({ ...form, topics: e.target.value })}
            sx={{
              '& .MuiInputLabel-root.Mui-focused': { color: '#262626' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#262626' },
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Resources"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Comma-separated (e.g., YouTube, Udemy)"
            value={form.resources}
            onChange={(e) => setForm({ ...form, resources: e.target.value })}
            sx={{
              '& .MuiInputLabel-root.Mui-focused': { color: '#262626' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#262626' },
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Target Date"
            type="date"
            fullWidth
            variant="outlined"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            sx={{
              '& .MuiInputLabel-root.Mui-focused': { color: '#262626' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#262626' },
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{
            '& .MuiInputLabel-root.Mui-focused': { color: '#262626' },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#262626' },
            }
          }}>
            <InputLabel>Progress</InputLabel>
            <Select
              value={form.progress}
              label="Progress"
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            px: 4,
            borderRadius: 3,
            textTransform: 'none',
            backgroundColor: '#262626',
            color: '#fff',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#000'
            }
          }}
        >
          Create Plan
        </Button>
      </Box>
    </Paper>
  );
}
