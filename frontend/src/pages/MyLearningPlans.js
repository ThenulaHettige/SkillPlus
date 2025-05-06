import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Box,
  Chip,
  InputLabel,
  Divider,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { toast } from "react-toastify";
import Leftsidebar from "../components/homepage/Leftsidebar";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import AddLearningPlanForm from "../pages/AddLearningPlan";

export default function MyLearningPlans() {
  const [plans, setPlans] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/learning-plans/my");
      setPlans(res.data);
    } catch (err) {
      toast.error("Could not fetch learning plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenEdit = (plan) => {
    setEditForm({
      ...plan,
      topics: plan.topics.join(", "),
      resources: plan.resources.join(", "),
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (editForm.targetDate < today) {
      toast.error("Target date cannot be in the past.");
      return;
    }

    try {
      await axios.post("/learning-plans", {
        ...editForm,
        topics: editForm.topics.split(",").map((t) => t.trim()),
        resources: editForm.resources.split(",").map((r) => r.trim()),
      });
      toast.success("Plan updated!");
      fetchPlans();
      setEditDialogOpen(false);
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/learning-plans/${id}`);
      toast.success("Plan deleted!");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const getProgressInfo = (progress) => {
    switch (progress) {
      case "Completed":
        return {
          color: "#4caf50",
          icon: <CheckCircleIcon fontSize="small" />,
          bgColor: "rgba(76, 175, 80, 0.1)",
        };
      case "In Progress":
        return {
          color: "#2196f3",
          icon: <AccessTimeIcon fontSize="small" />,
          bgColor: "rgba(33, 150, 243, 0.1)",
        };
      case "On Hold":
        return {
          color: "#ff9800",
          icon: <PauseCircleIcon fontSize="small" />,
          bgColor: "rgba(255, 152, 0, 0.1)",
        };
      default:
        return {
          color: "#757575",
          icon: <BookmarkIcon fontSize="small" />,
          bgColor: "rgba(117, 117, 117, 0.1)",
        };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "#fff",
      }}
    >
      

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#000",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40%",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "#262626",
                  bottom: "-10px",
                  left: "0",
                },
              }}
            >
              My Learning Plans
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                bgcolor: "#262626",
                color: "#fff",
                borderRadius: 8,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  bgcolor: "#000",
                },
              }}
            >
              Create New Plan
            </Button>
          </Box>

          {loading ? (
            <LinearProgress sx={{ bgcolor: "#DBDBDB", color: "#000" }} />
          ) : plans.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                bgcolor: "#fff",
                borderRadius: 4,
                border: "1px solid #DBDBDB",
              }}
            >
              <BookmarkIcon sx={{ fontSize: 60, color: "#DBDBDB", mb: 2 }} />
              <Typography variant="h5" color="#000" gutterBottom>
                No Learning Plans Yet
              </Typography>
              <Typography variant="body1" color="#262626" mb={3}>
                Create your first learning plan to track your progress
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  bgcolor: "#262626",
                  color: "#fff",
                  borderRadius: 8,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#000",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => {
                const progressInfo = getProgressInfo(plan.progress);
                return (
                  <Grid item xs={12} sm={6} md={4} key={plan.id}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        border: "1px solid #DBDBDB",
                        backgroundColor: "#fff",
                        height: "100%",
                        boxShadow: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0px 8px 20px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="#000"
                          >
                            {plan.title}
                          </Typography>
                          <Chip
                            icon={progressInfo.icon}
                            label={plan.progress}
                            size="small"
                            sx={{
                              bgcolor: progressInfo.bgColor,
                              color: progressInfo.color,
                              fontWeight: 500,
                              "& .MuiChip-icon": {
                                color: progressInfo.color,
                              },
                            }}
                          />
                        </Box>

                        <Box mb={1}>
                          <Typography
                            variant="subtitle2"
                            color="#262626"
                            fontWeight="600"
                          >
                            Topics
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {plan.topics.map((topic, idx) => (
                              <Chip
                                key={idx}
                                label={topic}
                                size="small"
                                sx={{ bgcolor: "#f5f5f5", color: "#000" }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: "#DBDBDB" }} />

                        <Box mb={1}>
                          <Typography
                            variant="subtitle2"
                            color="#262626"
                            fontWeight="600"
                          >
                            Resources
                          </Typography>
                          <Typography variant="body2" color="#262626">
                            {plan.resources.join(", ")}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="#262626" mt={1}>
                          <strong>Target Date:</strong>{" "}
                          {new Date(plan.targetDate).toLocaleDateString()}
                        </Typography>

                        <Box
                          mt={3}
                          display="flex"
                          justifyContent="flex-end"
                          gap={1}
                        >
                          <IconButton
                            onClick={() => handleOpenEdit(plan)}
                            sx={{ color: "#262626" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => setConfirmDeleteId(plan.id)}
                            sx={{ color: "#f44336" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!confirmDeleteId}
            onClose={() => setConfirmDeleteId(null)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>Delete Learning Plan?</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone. The plan will be permanently
                removed.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setConfirmDeleteId(null)}
                sx={{
                  color: "#757575",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleDelete(confirmDeleteId)}
                sx={{
                  bgcolor: "#f44336",
                  textTransform: "none",
                  borderRadius: 8,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#d32f2f",
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Plan Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#262626" }}
              >
                Edit Learning Plan
              </Typography>
            </DialogTitle>
            <DialogContent>
              {editForm && (
                <Box sx={{ pt: 2 }}>
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#2196f3",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#2196f3",
                      },
                    }}
                  />

                  <TextField
                    label="Topics (comma-separated)"
                    fullWidth
                    margin="normal"
                    value={editForm.topics}
                    onChange={(e) =>
                      setEditForm({ ...editForm, topics: e.target.value })
                    }
                    helperText="Separate multiple topics with commas"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#2196f3",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#2196f3",
                      },
                    }}
                  />

                  <TextField
                    label="Resources (comma-separated)"
                    fullWidth
                    margin="normal"
                    value={editForm.resources}
                    onChange={(e) =>
                      setEditForm({ ...editForm, resources: e.target.value })
                    }
                    helperText="Separate multiple resources with commas"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#2196f3",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#2196f3",
                      },
                    }}
                  />

                  <TextField
                    label="Target Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={editForm.targetDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, targetDate: e.target.value })
                    }
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#2196f3",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#2196f3",
                      },
                    }}
                  />

                  <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                    <InputLabel
                      id="progress-label"
                      sx={{ "&.Mui-focused": { color: "#2196f3" } }}
                    >
                      Progress Status
                    </InputLabel>
                    <Select
                      labelId="progress-label"
                      value={editForm.progress}
                      label="Progress Status"
                      onChange={(e) =>
                        setEditForm({ ...editForm, progress: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          "&.Mui-focused": {
                            borderColor: "#2196f3",
                          },
                        },
                      }}
                    >
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="On Hold">On Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                sx={{
                  color: "#757575",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleEditSave}
                sx={{
                  bgcolor: "#000000",
                  color: "White",
                  borderRadius: 8,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#000000",
                  },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
          <Modal
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={openAddModal}>
              <Box
                sx={{
                  width: "90%",
                  maxWidth: 650,
                  mx: "auto",
                  mt: "10vh",
                  outline: "none",
                }}
              >
                <AddLearningPlanForm
                  onClose={() => setOpenAddModal(false)}
                  onPlanCreated={fetchPlans}
                />
              </Box>
            </Fade>
          </Modal>
        </Container>
      </Box>
      <Leftsidebar />
    </Box>
  );
}
