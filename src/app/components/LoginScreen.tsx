import { useState } from "react";
import {
  User,
  Gamepad2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import {
  MOCK_USERS,
  MIN_BALANCE_REQUIRED,
} from "../data/mockData";
import type { KhachHang } from "../types";

interface LoginScreenProps {
  machineId: string;
  onLogin: (user: KhachHang) => void;
  onBack: () => void;
}

export function LoginScreen({
  machineId,
  onLogin,
  onBack,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) =>
          u.tenDangNhap === username && u.matKhau === password,
      );

      if (!user) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác");
        setIsLoading(false);
        return;
      }

      if (user.soDu < MIN_BALANCE_REQUIRED) {
        setError(
          `Số dư không đủ. Yêu cầu tối thiểu ${MIN_BALANCE_REQUIRED.toLocaleString(
            "vi-VN",
          )}đ`,
        );
        setIsLoading(false);
        return;
      }

      onLogin({
        ...user,
        maMayHienTai: machineId,
      });
      setIsLoading(false);
    }, 800);
  };

  const handleDemoLogin = (
    demoUser: (typeof MOCK_USERS)[0],
  ) => {
    setUsername(demoUser.tenDangNhap);
    setPassword(demoUser.matKhau);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* UI phần này giữ nguyên, chỉ sửa logic map dữ liệu bên dưới */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-4 shadow-2xl">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-2">
            Cyber Game Customer Portal
          </h1>
          <p className="text-white/70 text-sm mb-4 text-center">
            Máy đang sử dụng:{" "}
            <span className="text-cyan-400">{machineId}</span>
          </p>
          <button
            onClick={onBack}
            className="mb-4 text-sm text-white/70 hover:text-white transition"
          >
            ← Chọn máy khác
          </button>
          <p className="text-purple-200">
            Đăng nhập để bắt đầu phiên chơi
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-5">
            <div>
              <label className="block text-white/90 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nhập tên đăng nhập"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleLogin()
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Nhập mật khẩu"
                onKeyPress={(e) =>
                  e.key === "Enter" && handleLogin()
                }
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm mb-3">
              Tài khoản demo:
            </p>
            <div className="space-y-2">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.maKhachHang} // Sửa thành maKhachHang
                  onClick={() => handleDemoLogin(user)}
                  className="w-full bg-white/10 hover:bg-white/20 rounded-lg p-3 text-left transition-all duration-200 border border-white/10 hover:border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">
                        {user.tenDangNhap}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Wallet className="w-3 h-3 text-green-400" />
                        <p
                          className={`text-xs ${
                            user.soDu < MIN_BALANCE_REQUIRED
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {user.soDu.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}