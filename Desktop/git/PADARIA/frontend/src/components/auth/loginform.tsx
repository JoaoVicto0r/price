"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const success = await login(email, password);
      if (success) {
        window.location.href = "/dashboard";
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
    } finally {
      setPassword("");
    }
  };

  // ... restante do seu JSX ...
}