import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Wallet,
} from "lucide-react";
// 1. Sửa import TopUpRequest thành LichSuGiaoDich
import type { LichSuGiaoDich } from "../types";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  maKhachHang: string; // 2. Thêm prop maKhachHang để tạo giao dịch đúng
  onTopUpRequest: (request: LichSuGiaoDich) => void;
}

const QUICK_AMOUNTS = [
  10000, 20000, 50000, 100000, 200000, 500000,
];

const MIN_AMOUNT = 10;
const MAX_AMOUNT = 5000;
const STEP = 5000;

export function TopUpModal({
  isOpen,
  onClose,
  balance,
  maKhachHang,
  onTopUpRequest,
}: TopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSelect = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    // Chỉ giữ số
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) {
      setCustomAmount("");
      setAmount("");
      return;
    }

    let num = parseInt(numericValue, 10);

    // Giới hạn min/max
    if (num > MAX_AMOUNT) num = MAX_AMOUNT;

    // Lưu giá trị thực và hiển thị
    setAmount(num.toString() + "000");
    setCustomAmount(num.toLocaleString("vi-VN"));
  };

  const handleSubmit = () => {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum < MIN_AMOUNT * 1000) {
      return;
    }

    setIsSubmitting(true);

    // 3. Tạo đối tượng LichSuGiaoDich thay vì TopUpRequest
    const request: LichSuGiaoDich = {
      maGiaoDich: `gd-${Date.now()}`,
      maKhachHang: maKhachHang,
      loaiGiaoDich: "NAP_TIEN",
      soTien: amountNum, // Dùng soTien thay vì amount
      thoiGian: new Date(),
      trangThai: 0, // 0: Chờ duyệt (thay vì "pending")
      ghiChu: "Khách nạp tại máy",
    };

    // Simulate delay
    setTimeout(() => {
      onTopUpRequest(request);
      setIsSubmitting(false);
      setAmount("");
      setCustomAmount("");
    }, 1000);
  };

  const selectedAmount = parseInt(amount) || 0;

  const isValidAmount =
    selectedAmount >= MIN_AMOUNT * 1000 &&
    selectedAmount <= MAX_AMOUNT * 1000 &&
    selectedAmount % STEP === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Nạp tiền</h2>
              <p className="text-green-100 text-sm">
                Gửi yêu cầu nạp tiền
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Balance */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200">
                  Số dư hiện tại
                </span>
              </div>
              <span className="text-white text-xl">
                {balance.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Quick Amount Selection */}
          <div className="mb-6">
            <label className="block text-white mb-3">
              Chọn nhanh số tiền
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickSelect(value)}
                  className={`py-3 rounded-lg transition-all ${
                    amount === value.toString()
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {(value / 1000).toLocaleString("vi-VN")}k
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-6">
            <label className="block text-white mb-3">
              Hoặc nhập số tiền khác
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={customAmount}
                onChange={(e) =>
                  handleCustomAmountChange(e.target.value)
                }
                placeholder="Nhập số tiền (tối thiểu 10)"
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="bg-white/10 border border-l-0 border-white/20 rounded-r-lg px-4 py-3 text-white ">
                .000 VNĐ
              </div>
            </div>

            {customAmount && !isValidAmount && (
              <p className="text-red-400 text-sm mt-2">
                Số tiền phải từ 10.000đ đến 5.000.000đ và là bội
                của 5.000đ
              </p>
            )}
            {/* Preview */}
            {customAmount && (
              <p className="text-green-400 text-sm mt-2">
                = {parseInt(amount).toLocaleString("vi-VN")}đ
              </p>
            )}
          </div>

          {/* Preview */}
          {isValidAmount && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-200">
                  Số tiền nạp
                </span>
                <span className="text-white">
                  {selectedAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-200">
                  Số dư sau khi nạp
                </span>
                <span className="text-green-400">
                  {(balance + selectedAmount).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 text-sm mb-1">
                  Lưu ý:
                </p>
                <ul className="text-yellow-200/80 text-xs space-y-1 list-disc list-inside">
                  <li>Yêu cầu sẽ được gửi đến quầy admin</li>
                  <li>
                    Số dư sẽ được cập nhật sau khi admin duyệt
                  </li>
                  <li>Thời gian xử lý: 1-3 phút</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isValidAmount || isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600
    hover:from-green-600 hover:to-emerald-700
    disabled:from-gray-600 disabled:to-gray-700
    disabled:cursor-not-allowed
    text-white py-3 rounded-lg transition-all duration-200
    disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang gửi yêu cầu...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Gửi yêu cầu nạp tiền
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 4. Component hiển thị Toast (TopUpStatus)
interface TopUpStatusProps {
  request: LichSuGiaoDich; // Đổi type
  onClose: () => void;
}

export function TopUpStatus({
  request,
  onClose,
}: TopUpStatusProps) {
  // Logic hiển thị dựa trên trạng thái số (0, 1, 2)
  const getStatusConfig = () => {
    switch (request.trangThai) {
      case 0: // Chờ duyệt
        return {
          icon: Clock,
          color: "yellow",
          title: "Đang chờ duyệt",
          message: "Yêu cầu nạp tiền của bạn đang được xử lý",
        };
      case 1: // Thành công
        return {
          icon: CheckCircle,
          color: "green",
          title: "Đã duyệt",
          message: "Số dư đã được cập nhật thành công",
        };
      case 2: // Từ chối/Hủy
      default:
        return {
          icon: XCircle,
          color: "red",
          title: "Từ chối",
          message:
            "Yêu cầu nạp tiền bị từ chối. Vui lòng liên hệ quầy",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border shadow-2xl max-w-sm ${
          config.color === "yellow"
            ? "border-yellow-500/30"
            : config.color === "green"
              ? "border-green-500/30"
              : "border-red-500/30"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              config.color === "yellow"
                ? "bg-yellow-500/20"
                : config.color === "green"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                config.color === "yellow"
                  ? "text-yellow-400"
                  : config.color === "green"
                    ? "text-green-400"
                    : "text-red-400"
              } ${request.trangThai === 0 ? "animate-pulse" : ""}`}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-white mb-1">{config.title}</h4>
            <p className="text-white/60 text-sm mb-2">
              {config.message}
            </p>
            <p
              className={`${
                config.color === "yellow"
                  ? "text-yellow-400"
                  : config.color === "green"
                    ? "text-green-400"
                    : "text-red-400"
              }`}
            >
              {request.soTien.toLocaleString("vi-VN")}đ
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}