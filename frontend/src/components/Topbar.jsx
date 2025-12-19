import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider,
  ListItemIcon,
  Chip,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo & Brand Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mr: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #cc0102 0%, #cc0102 100%)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            <DirectionsCarIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.15rem",
                lineHeight: 1.2,
              }}
            >
              RentFlow
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              RENTAL MANAGEMENT
            </Typography>
          </Box>
        </Box>

        {/* Status Chip */}
        <Chip
          label="System Active"
          size="small"
          sx={{
            height: 24,
            fontSize: "0.7rem",
            fontWeight: 600,
            backgroundColor: "rgba(46, 125, 50, 0.1)",
            color: "success.main",
            border: "1px solid",
            borderColor: "success.light",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Help Button */}
          <IconButton
            size="medium"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              },
            }}
          >
            <HelpOutlineIcon />
          </IconButton>

          {/* Notifications */}
          <IconButton
            size="medium"
            onClick={handleNotificationClick}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton
            size="medium"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              },
            }}
          >
            <SettingsIcon />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, borderColor: "divider" }}
          />

          {/* User Profile */}
          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                Rental Admin
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.7rem",
                }}
              >
                Administrator
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
              }}
            >
              R
            </Avatar>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              minWidth: 220,
              mt: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Rental Admin
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              admin@rentflow.com
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={handleClose}
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              minWidth: 320,
              mt: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          <MenuItem onClick={handleClose} sx={{ py: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                New rental booking received
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Toyota Camry - 2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} sx={{ py: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Vehicle maintenance due
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Honda Accord - 1 hour ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} sx={{ py: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Payment received
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                ₹2,500 - 3 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              View all notifications
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}