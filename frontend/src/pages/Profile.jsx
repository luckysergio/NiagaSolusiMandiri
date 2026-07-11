import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Key,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../contexts/ModalContext";
import { profileApi } from "../api/profile";

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const { showError, showSuccess, showLoading, closeLoading } = useModal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getProfile();
      
      if (response.success) {
        const data = response.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
        });
        // Update user context
        if (authUser && setUser) {
          setUser({ ...authUser, ...data });
        }
      } else {
        showError("Gagal", response.message || "Gagal memuat data profile");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      showError("Gagal", "Gagal memuat data profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (!formData.name && !formData.email) {
      showError("Validasi Gagal", "Minimal satu field harus diisi");
      return;
    }

    try {
      setSaving(true);
      showLoading("Menyimpan...", "Mohon tunggu sebentar");

      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;

      const response = await profileApi.updateProfile(payload);
      closeLoading();

      if (response.success) {
        showSuccess("Berhasil", response.message || "Profile berhasil diperbarui");
        if (authUser && setUser && response.data) {
          setUser({ ...authUser, ...response.data });
        }
        await fetchProfile();
      } else {
        const errors = response.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          showError(
            "Gagal",
            Array.isArray(firstError) ? firstError[0] : "Terjadi kesalahan"
          );
        } else {
          showError("Gagal", response.message || "Gagal update profile");
        }
      }
    } catch (err) {
      closeLoading();
      console.error("Update profile error:", err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        showError(
          "Gagal",
          Array.isArray(firstError) ? firstError[0] : "Terjadi kesalahan"
        );
      } else {
        showError(
          "Gagal",
          err.response?.data?.message || "Terjadi kesalahan saat update profile"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password) {
      showError("Validasi Gagal", "Password lama wajib diisi");
      return;
    }

    if (!passwordData.new_password) {
      showError("Validasi Gagal", "Password baru wajib diisi");
      return;
    }

    if (passwordData.new_password.length < 6) {
      showError("Validasi Gagal", "Password baru minimal 6 karakter");
      return;
    }

    try {
      showLoading("Menyimpan...", "Mohon tunggu sebentar");

      const response = await profileApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      closeLoading();

      if (response.success) {
        showSuccess("Berhasil", response.message || "Password berhasil diubah");
        setPasswordData({
          current_password: "",
          new_password: "",
        });
      } else {
        const errors = response.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          showError(
            "Gagal",
            Array.isArray(firstError) ? firstError[0] : "Terjadi kesalahan"
          );
        } else {
          showError("Gagal", response.message || "Gagal update password");
        }
      }
    } catch (err) {
      closeLoading();
      console.error("Change password error:", err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        showError(
          "Gagal",
          Array.isArray(firstError) ? firstError[0] : "Terjadi kesalahan"
        );
      } else {
        showError(
          "Gagal",
          err.response?.data?.message || "Terjadi kesalahan saat update password"
        );
      }
    }
  };

  // Helper untuk mendapatkan role name dengan aman
  const getRoleName = (role) => {
    if (!role) return "-";
    if (typeof role === 'string') return role;
    if (typeof role === 'object' && role.name) return role.name;
    return "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-indigo-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-slate-400">Memuat profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Profile
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Kelola informasi akun Anda
          </p>
        </div>
        <button
          onClick={fetchProfile}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Informasi Akun</h3>
            <p className="text-slate-400 text-sm">
              Anda login sebagai{" "}
              <span className="text-indigo-400 font-medium">
                {authUser?.name || "User"}
              </span>{" "}
              dengan role{" "}
              <span className="text-emerald-400 font-medium">
                {getRoleName(authUser?.role)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "password"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Ubah Password
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSubmitProfile}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Nama
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Nama lengkap"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kosongkan jika tidak ingin mengubah
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="email@domain.com"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kosongkan jika tidak ingin mengubah
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: authUser?.name || "",
                    email: authUser?.email || "",
                  });
                }}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Change Password */}
      {activeTab === "password" && (
        <form onSubmit={handleSubmitPassword}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 space-y-4">
            <p className="text-sm text-slate-400">
              Untuk keamanan, Anda harus memasukkan password lama sebelum
              mengganti password baru.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password Lama <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Masukkan password lama"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password Baru <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                  });
                }}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Ubah Password
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;