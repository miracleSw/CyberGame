import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
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
  Utensils,     // Icon mới
  CheckCircle,  // Icon mới
  History       // Icon mới
} from "lucide-react";
// Import thêm HoaDon
import type { PhienChoi, HoaDon } from "../types";
import { COST_PER_MINUTE } from "../data/mockData";

interface SessionDashboardProps {
  session: PhienChoi;
  balance: number;
  orders: HoaDon[]; // <--- 1. THÊM PROP NÀY
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
  orders, // <--- 2. NHẬN PROP
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
  
  // State Password handling... (Giữ nguyên logic cũ của bạn)
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

  // Effects (Giữ nguyên logic đồng hồ & trừ tiền cũ của bạn)
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

  const balancePercentage = (balance / 100000) * 100;
  const isCriticalBalance = balance < COST_PER_MINUTE * 5;


  useEffect(() => {
    if (isCriticalBalance) {
      toast.warning("Cảnh báo: Sắp hết giờ chơi!", {
        description: "Số dư tài khoản đang ở mức thấp. Vui lòng nạp thêm.",
        duration: 8000,
        // (Tuỳ chọn) Thêm nút bấm nhanh
        action: {
          label: "Nạp ngay",
          onClick: () => {
             onOpenTopUp()
          }
        }
      });
    }
  }, [isCriticalBalance]);

  // Giữ nguyên hàm handlePasswordSubmit...
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
      <div className="fixed top-0 right-0 h-screen w-80 z-40 flex shadow-2xl">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full bg-slate-900/95 backdrop-blur-md border-l border-white/10 flex flex-col h-full"
        >
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

          {/* --- BODY (SCROLLABLE) --- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {/* 1. Số dư */}
            <div className={`p-4 rounded-xl border transition-all ${
                isCriticalBalance ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"
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
            <div className="p-4 rounded-xl bg-blue-500/5 border border-white/5 flex items-center justify-between">
              <div>
                 <p className="text-base uppercase text-white font-bold mb-1">Thời gian đã chơi</p>
                 <p className="text-xl font-mono text-white">{formatTime(timeElapsed)}</p>
              </div>
              <Clock className="w-8 h-8 text-white" />
            </div>

            {/* --- KẺ NGANG PHÂN CÁCH --- */}
            <div className="h-px bg-white/10 my-2"></div>

            {/* 4. DANH SÁCH ĐƠN HÀNG (MỚI THÊM VÀO ĐÂY) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-xs font-bold uppercase flex items-center gap-2">
                  <Utensils size={12} /> Đơn hàng ({orders.length})
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                  <History className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white text-xs">Chưa gọi món nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Map ngược để đơn mới nhất lên đầu */}
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
                        <span className="text-white/30">{order.ngayTao.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="text-white font-bold">{order.tongTien.toLocaleString()}đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin giờ hệ thống */}
            <div className="text-center pt-2 pb-4">
               <p className="text-white text-[12px] font-mono">{currentTime.toLocaleTimeString("vi-VN")}</p>
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
          </div>
        </motion.div>
      </div>

      {/* --- MODAL PASSWORD --- */}
      {showPasswordModal && (
        // ... (Giữ nguyên code Modal đổi mật khẩu cũ của bạn ở đây) ...
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
           {/* Copy lại nội dung modal từ file cũ dán vào đây */}
           {/* Để gọn code mình không paste lại đoạn này vì nó không thay đổi */}
           {/* Nếu bạn cần mình paste lại toàn bộ thì báo nhé */}
           <motion.div className="bg-slate-900 p-6 rounded-xl border border-white/10 max-w-sm w-full">
              <h3 className="text-white mb-4">Đổi mật khẩu</h3>
              {/* Form inputs... */}
              <div className="space-y-3">
                 <input type="password" placeholder="Mật khẩu cũ" className="w-full p-2 bg-white/5 rounded text-white" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
                 <input type="password" placeholder="Mật khẩu mới" className="w-full p-2 bg-white/5 rounded text-white" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                 <input type="password" placeholder="Xác nhận" className="w-full p-2 bg-white/5 rounded text-white" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
              </div>
              <div className="flex gap-2 mt-4">
                 <button onClick={handlePasswordSubmit} className="flex-1 bg-purple-600 text-white p-2 rounded">Lưu</button>
                 <button onClick={()=>setShowPasswordModal(false)} className="flex-1 bg-white/10 text-white p-2 rounded">Hủy</button>
              </div>
           </motion.div>
        </div>
      )}
    </>
  );
}