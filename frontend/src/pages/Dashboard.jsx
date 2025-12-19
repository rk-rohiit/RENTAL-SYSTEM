import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ConstructionIcon from "@mui/icons-material/Construction";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";


import {
  getDashboardStats,
  getDashboardCustomers,
  getDashboardVehicles,
} from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewType, setViewType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= SEARCH HANDLER ================= */
  const handleSearch = async () => {
    if (!viewType) return;

    setTableLoading(true);
    setTableData([]);

    try {
      if (viewType === "customers") {
        const data = await getDashboardCustomers();
        setTableData(data);
      }

      if (viewType === "vehicles") {
        const data = await getDashboardVehicles();
        setTableData(data);
      }
    } catch (error) {
      console.error("Dashboard Table Error:", error);
    } finally {
      setTableLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: <PeopleIcon />,
      color: "bg-blue-500",
    },
    {
      label: "Total Vehicles",
      value: stats.totalVehicles,
      icon: <DirectionsCarIcon />,
      color: "bg-indigo-500",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <CurrencyRupeeIcon />,
      color: "bg-green-500",
    },
    {
      label: "Available Vehicles",
      value: stats.availableVehicles,
      icon: <DirectionsCarIcon />,
      color: "bg-teal-500",
    },
    {
      label: "Rented Vehicles",
      value: stats.rentedVehicles,
      icon: <CarCrashIcon />,
      color: "bg-red-500",
    },
    {
      label: "In Maintenance",
      value: stats.maintenanceVehicles,
      icon: <ConstructionIcon />,
      color: "bg-yellow-500",
    },
  ];

  return (
    <Box className="p-8 bg-gray-100 min-h-screen">
      <Typography
        variant="h4"
        className="text-center font-bold mb-10 uppercase tracking-wide text-gray-800"
      >
        🚗 Rental System Dashboard
      </Typography>

      {/* ================= STATS CARDS ================= */}
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="transition-all duration-300 bg-white">
              <Box
                className={`p-4 flex justify-center ${card.color} text-white`}
              >
                {React.cloneElement(card.icon, { fontSize: "large" })}
              </Box>

              <CardContent className="text-center p-6">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-gray-500 uppercase tracking-wide"
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h5"
                  className="font-extrabold text-gray-900 mt-2"
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= TABLE SECTION ================= */}
      <Paper className="mt-10 p-6">
        <Typography variant="h6" className="mb-4 font-semibold">
          View Details
        </Typography>

        <Box className="flex gap-4 items-center mb-6">
          <Select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">Select Type</MenuItem>
            <MenuItem value="customers">Customers</MenuItem>
            <MenuItem value="vehicles">Vehicles</MenuItem>
          </Select>

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!viewType}
          >
            Search
          </Button>
        </Box>

        {tableLoading ? (
          <Box className="flex justify-center py-6">
            <CircularProgress />
          </Box>
        ) : (
          tableData.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(tableData[0]).map((key) => (
                    <TableCell key={key} className="font-bold uppercase">
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((val, i) => (
                      <TableCell key={i}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
