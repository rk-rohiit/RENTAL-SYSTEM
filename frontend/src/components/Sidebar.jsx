import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Vehicles", icon: <DirectionsCarIcon />, path: "/vehicles" },
    { text: "Customers", icon: <PeopleAltIcon />, path: "/customers" },
    { text: "Rentals", icon: <ReceiptIcon />, path: "/rentals" },
    { text: "Payments", icon: <PaymentsIcon />, path: "/payments" }
  ];

  return (
    <Box 
      sx={{
        width: 240,
        background: "#FFFFFF",
        height: "100vh",
        boxShadow: "2px 0px 10px rgba(0,0,0,0.05)",
        p: 2,
        position: "fixed",
      }}
    >
      <List>
        {menu.map((m) => (
          <ListItemButton key={m.text} onClick={() => navigate(m.path)}>
            <ListItemIcon sx={{ color: "#cc0102" }}>{m.icon}</ListItemIcon>
            <ListItemText primary={m.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
