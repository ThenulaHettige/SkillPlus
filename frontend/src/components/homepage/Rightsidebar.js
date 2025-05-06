
import { Box, Avatar, Typography, Button } from "@mui/material";

export default function Rightsidebar({ user, allUsers, followStatus, handleFollowRequest, handleUnfollow }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: 300 },
        p: { xs: 1, md: 2 },
        display: "flex",
        flexDirection: "column",
        position: { md: "sticky" },
        top: 0,
        height: { md: "100vh" },
        overflow: { md: "auto" },
        bgcolor: "#FFFFFF",
        borderLeft: { md: "1px solid #DBDBDB" },
        borderRadius: { xs: 2, md: 0 },
      }}
    >
      {/* User Profile */}
      {user && (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 4,
            px: { xs: 2, md: 0 }
          }}
        >
          <Avatar
            sx={{ 
              width: { xs: 48, md: 56 }, 
              height: { xs: 48, md: 56 }, 
              mr: 2 
            }}
            src={user.profileImage ? `http://localhost:9090${user.profileImage}` : undefined}
            alt={user.username}
          >
            {!user.profileImage && user.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#000000" }}>
              {user.username || "User"}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: "#8e8e8e", display: { xs: 'none', sm: 'block' } }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Suggested For You */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="subtitle2" fontWeight="600" sx={{ color: "#262626" }}>
            Suggested for you
          </Typography>
          <Button 
            sx={{ 
              color: '#000000',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '0.8rem',
              p: 0
            }}
          >
            See All
          </Button>
        </Box>

        {allUsers
          .filter((u) => u.email !== user?.email)
          .slice(0, 5)
          .map((u) => (
            <Box
              key={u.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 2,
                  bgcolor: 'rgba(0,0,0,0.05)'
                }}
                src={u.profileImage}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ color: "#000000" }}>
                  {u.username}
                </Typography>
                <Typography variant="caption" sx={{ color: "#8e8e8e" }}>
                  Suggested for you
                </Typography>
              </Box>
              {followStatus[u.id] === "ACCEPTED" ? (
                <Button
                  size="small"
                  onClick={() => handleUnfollow(u.id)}
                  sx={{
                    color: '#000000',
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    p: 0.5
                  }}
                >
                  Following
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={() => handleFollowRequest(u.id)}
                  disabled={followStatus[u.id] !== "NONE"}
                  sx={{
                    color: '#0095f6',
                    textTransform: 'none',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    p: 0.5
                  }}
                >
                  {followStatus[u.id] === "PENDING" ? "Requested" : "Follow"}
                </Button>
              )}
            </Box>
          ))}
      </Box>

      {/* Footer Links */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Typography variant="caption" sx={{ color: "#8e8e8e", mb: 1 }}>
          © 2025 Skillplus
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations'].map(item => (
            <Typography 
              key={item} 
              variant="caption" 
              sx={{ 
                color: "#8e8e8e",
                '&:hover': { 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: "#000000"
                }
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
