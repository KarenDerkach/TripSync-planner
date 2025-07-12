import { useState, useEffect, useCallback } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { toast } from "sonner";

interface User {
  email: string;
  name: string;
  picture: string;
  sub: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  login: () => void;
  logout: () => void;
  refreshUser: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Fetch user profile from Google API
  const fetchUserProfile = useCallback(
    async (tokenInfo: { access_token: string }) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenInfo.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log("User profile data:", userData);

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Update auth state
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success("Logged in successfully!");
        return userData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile. Please try again.");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        throw error;
      }
    },
    []
  );

  // Google OAuth login setup
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful:", tokenResponse);
      fetchUserProfile(tokenResponse);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },
  });

  // Login function
  const login = useCallback(() => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    googleLogin();
  }, [googleLogin]);

  // Logout function
  const logout = useCallback(() => {
    try {
      googleLogout();
      localStorage.removeItem("user");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast.success("Logged out successfully!");

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error refreshing user:", error);
        logout();
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [logout]);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    refreshUser,
  };
};
