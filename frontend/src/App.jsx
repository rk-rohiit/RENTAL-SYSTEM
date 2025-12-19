import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/VehiclesPage";
import CustomersPage from "./pages/CustomerPage";
import RentalsPage from "./pages/RentalPage";
import PaymentPage from "./pages/PaymentPage";
import VehicleForm from "./pages/VehicleForm";

export default function App() {
  return (
   <>
      <Topbar />
      <Sidebar />

      {/* Page content */}
      <Box sx={{ ml: 30, mt: 8, p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
        </Routes>
      </Box>
      </>
  );
}
