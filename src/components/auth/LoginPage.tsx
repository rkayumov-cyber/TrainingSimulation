import { useState } from "react";
import { User, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const { loginAsAdmin, loginAsTrainee } = useAuth();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (isAdminMode) {
      if (!pin.trim()) {
        setError("PIN is required for administrator login");
        return;
      }
      setLoggingIn(true);
      const success = await loginAsAdmin(pin, name.trim());
      setLoggingIn(false);
      if (!success) {
        setError("Invalid PIN");
        setPin("");
      }
    } else {
      loginAsTrainee(name.trim());
    }
  };

  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Clinical Simulation
          </h1>
          <p className="text-slate-400 text-sm">
            Emergency Medicine Training Platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                autoFocus
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAdminMode}
              onChange={(e) => {
                setIsAdminMode(e.target.checked);
                if (!e.target.checked) setPin("");
                setError("");
              }}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
            />
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-sm text-slate-300">
              Sign in as administrator
            </span>
          </label>

          {isAdminMode && (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Admin PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  placeholder="Enter PIN"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-center tracking-widest"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            {loggingIn ? "Verifying..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
