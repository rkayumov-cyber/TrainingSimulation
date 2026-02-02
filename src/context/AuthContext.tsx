import React, { createContext, useState, useCallback, useEffect } from "react";
import type { AuthUser, AuthSettings } from "../types/auth";
import {
  getAuthSettings,
  saveAuthSettings,
  hashPin,
  verifyPin,
} from "../services/persistence/authStore";

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isSetupComplete: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  loginAsAdmin: (pin: string, name?: string) => Promise<boolean>;
  loginAsTrainee: (name: string) => void;
  logout: () => void;
  setupAdminPin: (pin: string) => Promise<void>;
  changeAdminPin: (currentPin: string, newPin: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "clinical-sim-auth-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authSettings, setAuthSettings] = useState<AuthSettings | null>(null);

  // Check for existing session and load auth settings on mount
  useEffect(() => {
    async function init() {
      const settings = await getAuthSettings();
      setAuthSettings(settings);
      setIsSetupComplete(settings?.setupComplete ?? false);

      // Restore session from sessionStorage
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        try {
          const user = JSON.parse(saved) as AuthUser;
          setCurrentUser(user);
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }

      setIsLoading(false);
    }
    init();
  }, []);

  const loginAsAdmin = useCallback(
    async (pin: string, name?: string): Promise<boolean> => {
      if (!authSettings) return false;
      const valid = await verifyPin(pin, authSettings.adminPinHash);
      if (valid) {
        const user: AuthUser = {
          name: name || "Admin",
          role: "admin",
          loginTime: Date.now(),
        };
        setCurrentUser(user);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return true;
      }
      return false;
    },
    [authSettings],
  );

  const loginAsTrainee = useCallback((name: string) => {
    const user: AuthUser = {
      name,
      role: "trainee",
      loginTime: Date.now(),
    };
    setCurrentUser(user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const setupAdminPin = useCallback(async (pin: string) => {
    const pinHash = await hashPin(pin);
    const settings: AuthSettings = {
      adminPinHash: pinHash,
      setupComplete: true,
    };
    await saveAuthSettings(settings);
    setAuthSettings(settings);
    setIsSetupComplete(true);
  }, []);

  const changeAdminPin = useCallback(
    async (currentPin: string, newPin: string): Promise<boolean> => {
      if (!authSettings) return false;
      const valid = await verifyPin(currentPin, authSettings.adminPinHash);
      if (!valid) return false;

      const newHash = await hashPin(newPin);
      const settings: AuthSettings = {
        adminPinHash: newHash,
        setupComplete: true,
      };
      await saveAuthSettings(settings);
      setAuthSettings(settings);
      return true;
    },
    [authSettings],
  );

  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isSetupComplete,
        isLoading,
        isAdmin,
        loginAsAdmin,
        loginAsTrainee,
        logout,
        setupAdminPin,
        changeAdminPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
