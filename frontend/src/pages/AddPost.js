import { useState } from "react";
import {
  Typography, TextField, Button, Box, Paper,
  IconButton, Stack, LinearProgress
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AddPost({ onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || files.length === 0) {
      toast.error("All fields and at least one image are required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created!");
      onPostCreated?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Post upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, backgroundColor: "#FFFFFF", border: "1px solid #DBDBDB" }}>
      <Typography variant="h5" fontWeight="bold" color="#000000" gutterBottom>
        Create New Post
      </Typography>

      <TextField
        fullWidth
        label="Title"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#FAFAFA',
            '& fieldset': { borderColor: '#DBDBDB' },
            '&:hover fieldset': { borderColor: '#262626' },
            '&.Mui-focused fieldset': { borderColor: '#262626' }
          }
        }}
        InputLabelProps={{ style: { color: "#8e8e8e" } }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#FAFAFA',
            '& fieldset': { borderColor: '#DBDBDB' },
            '&:hover fieldset': { borderColor: '#262626' },
            '&.Mui-focused fieldset': { borderColor: '#262626' }
          }
        }}
        InputLabelProps={{ style: { color: "#8e8e8e" } }}
      />

      <Box mt={2} mb={2}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<PhotoCamera />}
          sx={{
            textTransform: 'none',
            color: '#262626',
            borderColor: '#DBDBDB',
            backgroundColor: '#FAFAFA',
            '&:hover': {
              borderColor: '#262626',
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          Select Media
          <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileChange} />
        </Button>
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
        {files.map((file, i) => (
          <Box key={i} sx={{ position: "relative", width: 80, height: 80 }}>
            {file.type.startsWith("video/") ? (
              <video src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls />
            ) : (
              <img src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <IconButton
              size="small"
              onClick={() => handleRemoveFile(i)}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#FFFFFF",
                color: "#FF0000",
                '&:hover': { backgroundColor: "#F5F5F5" }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {isSubmitting && <LinearProgress sx={{ mt: 2, backgroundColor: "#DBDBDB", '& .MuiLinearProgress-bar': { backgroundColor: '#262626' } }} />}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting}
        sx={{
          mt: 3,
          textTransform: 'none',
          fontWeight: 600,
          backgroundColor: '#262626',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: '#000000' },
          '&.Mui-disabled': {
            backgroundColor: '#E0E0E0',
            color: '#A0A0A0'
          }
        }}
      >
        {isSubmitting ? "Uploading..." : "Create Post"}
      </Button>
    </Paper>
  );
}
