
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }
    try {
      const res = await axios.post("/auth/signin", { email, password });
      login(res.data.token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2
    }}>
      <Container
        maxWidth="sm"
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #DBDBDB',
          p: 5,
          borderRadius: 4,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            fontWeight={700} 
            mb={1} 
            align="center" 
            sx={{ 
              color: '#000000',
              letterSpacing: '-0.5px'
            }}
          >
            Skill Plus
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            mb={4} 
            sx={{ 
              color: '#262626',
              fontWeight: 500 
            }}
          >
            Welcome back! Sign in to your account
          </Typography>
        </motion.div>

        <Stack spacing={3}>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#000000' }} />
                </InputAdornment>
              )
            }}
            sx={inputStyles}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#000000' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: '#000000' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={inputStyles}
          />

          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              color: '#262626',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { 
                color: '#000000',
                textDecoration: 'underline'
              }
            }}
          >
            Forgot password?
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: '#262626',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#000000',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ 
            my: 3, 
            borderColor: '#DBDBDB'
          }}>
            <Typography variant="body2" sx={{ color: '#262626', px: 1 }}>
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon sx={{ color: '#EA4335' }} />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: '#DBDBDB',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f9f9f9',
                borderColor: '#BDBDBD',
                transform: 'translateY(-2px)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)'
              }
            }}
            onClick={() => window.location.href = "http://localhost:9090/oauth2/authorization/google"}
          >
            Sign in with Google
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: 3 
          }}>
            <Typography variant="body2" sx={{ color: '#262626' }}>
              Don't have an account?
            </Typography>
            <Typography
              component="span"
              onClick={() => navigate("/signup")}
              sx={{
                ml: 0.5,
                color: '#000000',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { 
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up
            </Typography>
          </Box>
        </Stack>
      </Container>
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
