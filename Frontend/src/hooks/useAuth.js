import {jwtDecode} from "jwt-decode";

export default function useAuth() {
  const token = localStorage.getItem("token");

  if (!token) return { user: null };

  try {
    const user = jwtDecode(token);
    return { user };
  } catch (err) {
    console.error("Invalid token", err);
    return { user: null };
  }
}
