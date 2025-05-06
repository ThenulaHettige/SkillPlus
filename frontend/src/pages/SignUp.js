
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Checkbox,
  FormControlLabel,
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const { fullName, email, password, confirmPassword } = formData;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreed) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", fullName);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      if (profileImage) {
        formDataToSend.append("file", profileImage);
      }

      const res = await axios.post("/auth/signup-with-image", formDataToSend);
      login(res.data.token);
      toast.success("Account created!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:9090/oauth2/authorization/google";
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      padding: 2
    }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 5,
          borderRadius: 4,
          bgcolor: "#FFFFFF",
          border: "1px solid #DBDBDB",
          boxShadow: "0 10px 20px rgba(0,0,0,0.04)"
        }}
      >
        <Typography variant="h4" fontWeight={700} align="center" mb={1} sx={{ color: "#000000" }}>
          Skill Plus
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: "#262626", fontWeight: 500, mb: 3 }}>
          Create an account to start your journey
        </Typography>

        <Box textAlign="center" mb={3}>
          <Avatar src={preview} sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
          <Button component="label" variant="outlined" startIcon={<AddAPhotoIcon />} sx={{
            borderColor: "#DBDBDB",
            color: "#262626",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f9f9f9",
              borderColor: "#BDBDBD"
            }
          }}>
            Upload Profile Image
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: "#262626" }} />
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#262626" }} />
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#262626" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#262626" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              sx={{ color: "#262626", "&.Mui-checked": { color: "#262626" } }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: "#262626" }}>
              I agree to the{" "}
              <span style={{ color: "#000000", fontWeight: 600, cursor: "pointer" }}>
                Terms & Conditions
              </span>
            </Typography>
          }
          sx={{ mt: 1 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: "#262626",
            color: "#FFFFFF",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#000000",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
            }
          }}
        >
          Sign Up
        </Button>

        <Divider sx={{ my: 3, borderColor: "#DBDBDB" }}>
          <Typography variant="body2" sx={{ color: "#262626", px: 1 }}>
            OR CONTINUE WITH
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
          onClick={handleGoogleSignup}
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: "#DBDBDB",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f9f9f9",
              borderColor: "#BDBDBD"
            }
          }}
        >
          Sign up with Google
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Typography variant="body2" sx={{ color: "#262626" }}>
            Already have an account?
          </Typography>
          <Typography
            component="span"
            onClick={() => navigate("/signin")}
            sx={{
              ml: 1,
              fontWeight: 600,
              cursor: "pointer",
              color: "#000000",
              "&:hover": { textDecoration: "underline" }
            }}
          >
            Sign In
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#DBDBDB' },
    '&:hover fieldset': { borderColor: '#262626' },
    '&.Mui-focused fieldset': { borderColor: '#262626' }
  },
  '& .MuiInputLabel-root': { color: '#262626' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#262626' }
};
