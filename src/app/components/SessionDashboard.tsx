import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react"; 
import {
  Clock,
  Wallet,
  Monitor,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  LogOut,
  Coffee,
  Key,
  User,
  Utensils,
  CheckCircle,
  History,
  ChevronRight, 
  Menu,
  ArrowUpRight, 
  ArrowDownLeft, 
} from "lucide-react";
import type { PhienChoi, HoaDon, LichSuGiaoDich } from "../types";
import { COST_PER_MINUTE } from "../data/mockData";

// Mock history khởi tạo
const INITIAL_HISTORY: LichSuGiaoDich[] = [
];

interface SessionDashboardProps {
  session: PhienChoi;
  balance: number;
  orders: HoaDon[];
  username: string;
  machineId: string;
  onBalanceUpdate: (updater: (prev: number) => number) => void;
  onOpenServices: () => void;
  onOpenTopUp: () => void;
  onPasswordChange: (oldPass: string, newPass: string) => boolean;
  onLogout: () => void;
}

export function SessionDashboard({
  session,
  balance,
  orders,
  username,
  machineId,
  onBalanceUpdate,
  onOpenServices,
  onOpenTopUp,
  onPasswordChange,
  onLogout,
}: SessionDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- STATE MỚI ---
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');
  const [history, setHistory] = useState<LichSuGiaoDich[]>(INITIAL_HISTORY);
  
  // Dùng ref để track thay đổi balance/order để tạo log
  const prevBalanceRef = useRef(balance);
  const prevOrdersLengthRef = useRef(orders.length);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [timeElapsed, setTimeElapsed] = useState(session.timeElapsed || 0);
  const COST_PER_SECOND = COST_PER_MINUTE / 60;
  const remainingSeconds = Math.max(Math.floor(balance / COST_PER_SECOND), 0);

  // Helper format
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      onBalanceUpdate((prevBalance) => {
        const newBalance = prevBalance - COST_PER_SECOND;
        if (newBalance <= 0) {
          onLogout();
          return 0;
        }
        return newBalance;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onBalanceUpdate, onLogout, COST_PER_SECOND]);

  // --- LOGIC TỰ ĐỘNG TẠO HISTORY ---
  useEffect(() => {
    // 1. Detect Nạp tiền (Balance tăng đột biến > 1000đ)
    if (balance > prevBalanceRef.current + 1000) {
      const diff = balance - prevBalanceRef.current;
      const newLog: LichSuGiaoDich = {
        maGiaoDich: `gd-${Date.now()}`,
        maKhachHang: session.maKhachHang,
        loaiGiaoDich: "NAP_TIEN",
        soTien: diff,
        thoiGian: new Date(),
        trangThai: 1,
        ghiChu: "Nạp tiền thành công"
      };
      setHistory(prev => [newLog, ...prev]);
    }
    prevBalanceRef.current = balance;
  }, [balance, session.maKhachHang]);

  useEffect(() => {
    // 2. Detect Gọi món (Order length tăng)
    if (orders.length > prevOrdersLengthRef.current) {
      const newOrder = orders[orders.length - 1]; // Lấy đơn mới nhất
      const newLog: LichSuGiaoDich = {
        maGiaoDich: `gd-order-${Date.now()}`,
        maKhachHang: session.maKhachHang,
        loaiGiaoDich: "TRU_TIEN_DICH_VU",
        soTien: newOrder.tongTien,
        thoiGian: new Date(),
        trangThai: 1,
        ghiChu: `Gọi món: ${newOrder.items[0]?.tenDichVu || 'Dịch vụ'}...`
      };
      setHistory(prev => [newLog, ...prev]);
    }
    prevOrdersLengthRef.current = orders.length;
  }, [orders, session.maKhachHang]);


  const balancePercentage = (balance / 100000) * 100;
  const isCriticalBalance = balance < COST_PER_MINUTE * 5;
  const hasShownWarningRef = useRef(false);

  useEffect(() => {
    if (isCriticalBalance && !hasShownWarningRef.current) {
      toast.warning("Cảnh báo: Sắp hết giờ chơi!", {
        description: "Số dư tài khoản sắp hết. Vui lòng nạp thêm.",
        duration: 8000,
        action: {
          label: "Nạp ngay",
          onClick: () => {
            onOpenTopUp()
          }
        }
      });
      hasShownWarningRef.current = true;
    }
  }, [isCriticalBalance, onOpenTopUp]);

  const handlePasswordSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    if (newPassword.length < 6) return;
    const success = onPasswordChange(oldPassword, newPassword);
    if (success) {
      setShowPasswordModal(false);
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCollapsed(false)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 transition-transform hover:scale-110 active:scale-95"
            title="Mở Dashboard"
          >
            <Menu className="w-6 h-6" />
            {isCriticalBalance && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed top-0 right-0 h-screen w-80 z-40 flex pointer-events-none">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isCollapsed ? "120%" : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full bg-slate-900/95 backdrop-blur-md border-l border-white/10 flex flex-col h-full pointer-events-auto relative"
        >

          <button
            onClick={() => setIsCollapsed(true)}
            className="absolute top-4 left-4 z-50 p-1.5 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Thu nhỏ Dashboard"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* --- HEADER --- */}
          <div className="p-6 border-b border-white/10 flex flex-col items-center text-center bg-gradient-to-b from-white/5 to-transparent flex-shrink-0">
            <div className="w-16 h-16 mb-2 relative">
              <div className="relative w-full h-full bg-slate-800 rounded-full flex items-center justify-center border border-white/10 shadow-xl">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-slate-900 w-5 h-5 rounded-full"></div>
            </div>
            <h2 className="text-white font-bold text-lg truncate w-full">{username}</h2>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Monitor className="w-3 h-3 text-blue-400" />
              <span className="text-blue-100 text-xs font-mono">{machineId}</span>
            </div>
          </div>

          <div className="p-4 pb-0 space-y-4">
            {/* 1. Số dư */}
            <div className={`p-4 rounded-xl border transition-all ${isCriticalBalance ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <Wallet className={`w-4 h-4 ${isCriticalBalance ? "text-red-400" : "text-green-400"}`} />
                <span className="text-base uppercase text-white font-medium">Số dư hiện tại</span>
              </div>
              <div className={`text-2xl font-mono font-bold ${isCriticalBalance ? "text-red-400" : "text-green-400"}`}>
                {balance.toLocaleString("vi-VN")}đ
              </div>
            </div>

            {/* 2. Thời gian còn lại */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-purple-400" />
                <span className="text-base uppercase text-white font-medium">Thời gian còn lại</span>
              </div>
              <div className="text-2xl font-mono font-bold text-purple-300">
                {formatTime(remainingSeconds)}
              </div>
            </div>

            {/* 3. Thời gian đã chơi */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-green-300" />
                <span className="text-base uppercase text-white font-medium">Thời gian đã dùng</span>
              </div>
              <div className="text-2xl font-mono font-bold text-green-300">
                {formatTime(timeElapsed)}
              </div>
            </div>

            {/* --- KẺ NGANG PHÂN CÁCH --- */}
            <div className="h-px bg-white/10 my-2"></div>

            {/* --- TAB SWITCHER (MỚI) --- */}
            <div className="flex items-center gap-2 p-1 bg-black/20 rounded-lg">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                        activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    <Utensils size={12} /> Đơn hàng ({orders.length})
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                        activeTab === 'history' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    <History size={12} /> Lịch sử
                </button>
            </div>
          </div>

          {/* --- BODY (SCROLLABLE) --- */}
          <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-4 custom-scrollbar">
            
            {/* NỘI DUNG TAB */}
            <div>
              {activeTab === 'orders' ? (
                // --- TAB ĐƠN HÀNG ---
                orders.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5 mt-2">
                    <ShoppingBag className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-xs">Chưa gọi món nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...orders].reverse().map((order) => (
                      <div
                        key={order.maHoaDon}
                        className="bg-black/20 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-orange-400 text-[10px] font-bold bg-orange-400/10 px-1.5 py-0.5 rounded">
                            #{order.maHoaDon.slice(-4)}
                          </span>
                          {order.trangThai === 0 ? (
                            <span className="text-[10px] text-yellow-500 flex items-center gap-1">
                              <Clock size={10} className="animate-spin-slow" /> Đang làm
                            </span>
                          ) : (
                            <span className="text-[10px] text-green-500 flex items-center gap-1">
                              <CheckCircle size={10} /> Xong
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 mb-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-white/80">
                              <span>{item.tenDichVu} <span className="text-white/30 text-[10px]">x{item.soLuong}</span></span>
                              <span className="font-mono text-white/50">{item.thanhTien.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                          <span className="text-white/30">{order.ngayTao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-white font-bold">{order.tongTien.toLocaleString()}đ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // --- TAB LỊCH SỬ ---
                history.length === 0 ? (
                    // Hiển thị khi trống
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5 mt-2">
                        <History className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-xs">Chưa có giao dịch nào</p>
                    </div>
                ) : (
                <div className="space-y-2">
                    {history.map((gd) => {
                        const isNap = gd.loaiGiaoDich === 'NAP_TIEN';
                        return (
                            <div key={gd.maGiaoDich} className="bg-black/20 rounded-lg p-2.5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNap ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {isNap ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-medium">{gd.ghiChu || (isNap ? 'Nạp tiền' : 'Trừ tiền')}</p>
                                        <p className="text-white/40 text-[10px]">{gd.thoiGian.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-mono font-bold ${isNap ? 'text-green-400' : 'text-red-400'}`}>
                                    {isNap ? '+' : '-'}{gd.soTien.toLocaleString()}đ
                                </span>
                            </div>
                        )
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* --- FOOTER: BUTTONS --- */}
          <div className="p-4 border-t border-white/10 bg-slate-950/50 space-y-3 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onOpenServices}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 transition-all group"
              >
                <Coffee className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Dịch vụ</span>
              </button>
              <button
                onClick={onOpenTopUp}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 transition-all group"
              >
                <CreditCard className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Nạp tiền</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 transition-all"
              >
                <Key className="w-4 h-4" />
                <span className="text-xs">Đổi MK</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold">Đăng xuất</span>
              </button>
            </div>
            {/* Thông tin giờ hệ thống */}
            <div className="text-center pt-2">
              <p className="text-white text-[12px] font-mono">{currentTime.toLocaleString("vi-VN")}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white">Đổi mật khẩu</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) =>
                    setOldPassword(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">
                      ⚠️ Mật khẩu xác nhận không khớp
                    </p>
                  </div>
                )}

              {newPassword && newPassword.length < 6 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={
                    !oldPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    newPassword.length < 6
                  }
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:text-white/40 text-white py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors border border-white/20"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}