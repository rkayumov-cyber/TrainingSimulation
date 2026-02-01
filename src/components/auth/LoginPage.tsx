import { useState } from "react";
import { Shield, User, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const { loginAsManager, loginAsDoctor } = useAuth();

  const [managerPin, setManagerPin] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [managerError, setManagerError] = useState("");
  const [doctorError, setDoctorError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setManagerError("");

    if (!managerPin.trim()) {
      setManagerError("PIN is required");
      return;
    }

    setLoggingIn(true);
    const success = await loginAsManager(managerPin);
    setLoggingIn(false);

    if (!success) {
      setManagerError("Invalid PIN");
      setManagerPin("");
    }
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorError("");

    if (!doctorName.trim()) {
      setDoctorError("Name is required");
      return;
    }

    loginAsDoctor(doctorName.trim());
  };

  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Clinical Simulation Engine
          </h1>
          <p className="text-slate-400 text-sm">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manager Login */}
          <form
            onSubmit={handleManagerLogin}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Manager Login</h2>
                <p className="text-slate-500 text-xs">
                  Full access to scenarios, templates, and settings
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Admin PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value)}
                  maxLength={6}
                  placeholder="Enter PIN"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-center tracking-widest"
                />
              </div>
            </div>

            {managerError && (
              <p className="text-red-400 text-xs">{managerError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              {loggingIn ? "Verifying..." : "Login as Manager"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Doctor Login */}
          <form
            onSubmit={handleDoctorLogin}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Doctor Login</h2>
                <p className="text-slate-500 text-xs">
                  Access simulations and view your progress
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {doctorError && (
              <p className="text-red-400 text-xs">{doctorError}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              Login as Doctor
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
