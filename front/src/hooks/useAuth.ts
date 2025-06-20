import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:8080/api";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const registerUser = async (login: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Registration failed`);
      }

      const authToken = data.token;
      const userId = data.id;

      if (authToken && userId) {
        setToken(authToken);
        localStorage.setItem("token", authToken);
        setIsAuthenticated(true);
        setUserId(userId);
        localStorage.setItem("userId", userId);
        return { success: true, token: authToken, userId };
      } else {
        throw new Error("No token or user ID received");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  const loginUser = async (login: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Login failed`);
      }
      const authToken = data.token;
      const userId = data.id;
      if (authToken && userId) {
        setToken(authToken);
        localStorage.setItem("token", authToken);
        setIsAuthenticated(true);
        setUserId(userId);
        localStorage.setItem("userId", userId);
        return { success: true, token: authToken, userId };
      } else {
        throw new Error("No token or user ID received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    isAuthenticated,
    userId,
    registerUser,
    loginUser,
    logout,
  };
};

export default useAuth;
