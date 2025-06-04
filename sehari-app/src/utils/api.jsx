const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Authentication failed");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

// export const handleLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.location.href = "/login";

