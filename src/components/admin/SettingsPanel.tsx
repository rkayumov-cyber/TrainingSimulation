import { useState } from "react";
import { Settings, Lock, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { clearActivityLog } from "../../services/persistence/authStore";
import { clearAllSessions } from "../../services/persistence";

export function SettingsPanel() {
  const { changeAdminPin } = useAuth();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);
  const [changing, setChanging] = useState(false);

  const handleChangePIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess(false);

    if (newPin.length < 4 || newPin.length > 6) {
      setPinError("New PIN must be 4-6 digits");
      return;
    }
    if (!/^\d+$/.test(newPin)) {
      setPinError("PIN must contain only digits");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("New PINs do not match");
      return;
    }

    setChanging(true);
    const success = await changeAdminPin(currentPin, newPin);
    setChanging(false);

    if (success) {
      setPinSuccess(true);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      setPinError("Current PIN is incorrect");
    }
  };

  const handleResetAllData = async () => {
    if (
      !confirm(
        "This will delete ALL session data and activity logs. This cannot be undone. Continue?",
      )
    )
      return;
    await clearAllSessions();
    await clearActivityLog();
    alert("All data has been reset.");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-emerald-400" />
        Settings
      </h2>

      {/* Change PIN */}
      <form
        onSubmit={handleChangePIN}
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4"
      >
        <h3 className="text-white font-medium flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          Change Admin PIN
        </h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Current PIN
          </label>
          <input
            type="password"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            maxLength={6}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            New PIN (4-6 digits)
          </label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            maxLength={6}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Confirm New PIN
          </label>
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            maxLength={6}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        {pinError && <p className="text-red-400 text-xs">{pinError}</p>}
        {pinSuccess && (
          <p className="text-emerald-400 text-xs">PIN changed successfully</p>
        )}

        <button
          type="submit"
          disabled={changing}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {changing ? "Changing..." : "Change PIN"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-slate-800 border border-red-500/20 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Danger Zone
        </h3>
        <p className="text-slate-400 text-xs">
          Reset all session data and activity logs. Custom scenarios will be
          preserved.
        </p>
        <button
          onClick={handleResetAllData}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm border border-red-500/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset All Data
        </button>
      </div>
    </div>
  );
}
