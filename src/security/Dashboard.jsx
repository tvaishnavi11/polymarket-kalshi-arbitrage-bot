import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return <h1>User Dashboard</h1>;
};

export default Dashboard;
