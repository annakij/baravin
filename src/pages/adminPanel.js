import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || user.role !== "Admin") {
    return <Navigate to="/" />; // skicka bort obehöriga
  }

  return <h1>Welcome Admin!</h1>;
};

export default AdminPanel;
