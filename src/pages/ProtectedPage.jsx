import { useEffect } from "react";
import { useFakeAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedPage({ children }) {
  const { isAuthenticated } = useFakeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}

export default ProtectedPage;
