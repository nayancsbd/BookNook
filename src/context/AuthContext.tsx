"use client";

import React, { createContext, useContext, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData?: Partial<User>) => void;
  logout: () => Promise<void>;
  toggleAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const [mockUser, setMockUser] = useState<User | null>(null);

  const activeUser: User | null = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        image: sessionData.user.image || undefined,
      }
    : mockUser;

  const login = (userData?: Partial<User>) => {
    const demo = {
      id: "usr_reader_01",
      name: "Eleanor Vance",
      email: "eleanor@booknook.library",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256&h=256",
      ...userData,
    };
    if (typeof document !== "undefined") {
      document.cookie = "better-auth.session_token=mock_session_token; path=/; max-age=604800; SameSite=Lax";
    }
    setMockUser(demo);
    toast.success("Welcome back!", {
      description: `Signed in as ${demo.name}`,
    });
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {}
    if (typeof document !== "undefined") {
      document.cookie = "better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setMockUser(null);
    toast.info("Signed out", {
      description: "You have been logged out of your library sanctuary.",
    });
  };

  const toggleAuth = () => {
    if (activeUser) {
      logout();
    } else {
      login();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        isLoading: sessionLoading,
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
