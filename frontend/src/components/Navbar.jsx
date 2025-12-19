import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Customers", path: "/customers" },
  { label: "Rentals", path: "/rentals" },
  { label: "Payments", path: "/payments" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const drawer = (
    <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="sticky" color="primary" elevation={4}>
        <Toolbar>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo + Title */}
          <DirectionsCarIcon sx={{ fontSize: 30, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 0.6
            }}
          >
            Rental Management
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&.active": {
                    color: "#FF6F61",
                    borderBottom: "2px solid #FF6F61"
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
}
