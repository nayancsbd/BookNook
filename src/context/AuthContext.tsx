"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

const DEMO_USER: User = {
  id: "usr_reader_01",
  name: "Eleanor Vance",
  email: "eleanor@booknook.library",
  image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256&h=256",
  role: "Curator",
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData?: Partial<User>) => void;
  logout: () => void;
  toggleAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem("booknook-mock-auth");
    if (savedState === "authenticated") {
      setUser(DEMO_USER);
    }
    setIsLoading(false);
  }, []);

  const login = (userData?: Partial<User>) => {
    const activeUser = { ...DEMO_USER, ...userData };
    setUser(activeUser);
    localStorage.setItem("booknook-mock-auth", "authenticated");
    toast.success("Welcome back!", {
      description: `Signed in as ${activeUser.name}`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("booknook-mock-auth");
    toast.info("Signed out", {
      description: "You have been logged out of your library sanctuary.",
    });
  };

  const toggleAuth = () => {
    if (user) {
      logout();
    } else {
      login();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        toggleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

