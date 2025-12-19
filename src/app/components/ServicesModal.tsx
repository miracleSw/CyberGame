import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Coffee,
  UtensilsCrossed,
  Cookie,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
// 1. Import các Type mới: DichVu, HoaDon, ChiTietHoaDon
import type { DichVu, HoaDon, ChiTietHoaDon } from "../types";
import { SERVICE_ITEMS } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  // 2. Thêm prop currentUser để biết ai đang đặt
  currentUser: {
    maKhachHang: string;
    maPhien: string;
  };
  onOrderComplete: (order: HoaDon) => void;
}

export function ServicesModal({
  isOpen,
  onClose,
  balance,
  currentUser,
  onOrderComplete,
}: ServicesModalProps) {
  // Cart lưu { maDichVu: soLuong }
  const [cart, setCart] = useState<{ [key: string]: number }>(
    {},
  );

  // 3. Filter category theo tiếng Việt (hoặc mapping)
  // Trong mockData bạn dùng: 'đồ ăn' | 'thức uống' ...
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "đồ ăn" | "thức uống"
  >("all");
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);

  const addToCart = (maDichVu: string) => {
    setCart((prev) => ({
      ...prev,
      [maDichVu]: (prev[maDichVu] || 0) + 1,
    }));
  };

  const removeFromCart = (maDichVu: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[maDichVu] > 1) {
        newCart[maDichVu]--;
      } else {
        delete newCart[maDichVu];
      }
      return newCart;
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce(
      (total, [maDichVu, quantity]) => {
        // 4. Tìm item theo maDichVu
        const item = SERVICE_ITEMS.find(
          (i) => i.maDichVu === maDichVu,
        );
        // 5. Lấy giá (gia)
        return total + (item?.gia || 0) * quantity;
      },
      0,
    );
  };

  const handleOrder = () => {
    const total = calculateTotal();

    if (total > balance) {
      return;
    }

    // 6. Tạo danh sách ChiTietHoaDon
    const orderItems: ChiTietHoaDon[] = Object.entries(
      cart,
    ).map(([maDichVu, quantity]) => {
      const item = SERVICE_ITEMS.find(
        (i) => i.maDichVu === maDichVu,
      )!;
      return {
        maDVHD: `dvhd-${Date.now()}-${maDichVu}`, // Mock ID
        maHoaDon: "", // Sẽ được DB tạo, ở đây để rỗng hoặc mock
        maDichVu: maDichVu,
        tenDichVu: item.ten, // Lưu tên để UI hiển thị dễ hơn
        soLuong: quantity,
        donGia: item.gia,
        thanhTien: item.gia * quantity,
        trangThai: "đang xử lý",
      };
    });

    // 7. Tạo đối tượng HoaDon
    const order: HoaDon = {
      maHoaDon: `hd-${Date.now()}`,
      maKhachHang: currentUser.maKhachHang,
      maPhien: currentUser.maPhien,
      items: orderItems,
      tongTien: total,
      ngayTao: new Date(),
      trangThai: 0, // 0: Chưa thanh toán/Đang xử lý
    };

    onOrderComplete(order);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setCart({});
      onClose();
    }, 2000);
  };

  // Filter Items logic
  const filteredItems = SERVICE_ITEMS.filter(
    (item) =>
      selectedCategory === "all" ||
      item.loaiDichVu === selectedCategory,
  );

  const total = calculateTotal();
  const isInsufficientBalance = total > balance;
  const cartItemCount = Object.values(cart).reduce(
    (a, b) => a + b,
    0,
  );

  // Mapping Icon theo loại dịch vụ
  const getCategoryIcon = (loai: string) => {
    switch (loai) {
      case "đồ ăn":
        return UtensilsCrossed;
      case "thức uống":
        return Coffee;
      default:
        return ShoppingCart;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[100vh] overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Gọi món</h2>
              <p className="text-orange-100 text-sm">
                Chọn đồ ăn & nước uống
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

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-10"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Đơn hàng đã được gửi!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <div className="p-6 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            {[
              {
                id: "all",
                label: "Tất cả",
                icon: ShoppingCart,
              },
              {
                id: "đồ ăn",
                label: "Đồ ăn",
                icon: UtensilsCrossed,
              },
              {
                id: "thức uống",
                label: "Nước uống",
                icon: Coffee,
              },
              // Thêm các loại khác nếu có trong mockData
            ].map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id as any)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const Icon = getCategoryIcon(item.loaiDichVu);
              const quantity = cart[item.maDichVu] || 0;

              return (
                <div
                  key={item.maDichVu}
                  className={`bg-white/5 rounded-xl p-4 border transition-all ${
                    item.available
                      ? "border-white/10 hover:border-orange-500/50"
                      : "border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <ImageWithFallback
                        src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.image)}`}
                        alt={item.ten}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-white text-sm">
                          {item.ten}
                        </h4>
                        <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      </div>
                      <p className="text-orange-400 mb-3">
                        {item.gia.toLocaleString("vi-VN")}đ
                      </p>

                      {!item.available ? (
                        <p className="text-red-400 text-xs">
                          Hết hàng
                        </p>
                      ) : quantity > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              removeFromCart(item.maDichVu)
                            }
                            className="w-7 h-7 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-red-400" />
                          </button>
                          <span className="text-white min-w-[2ch] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              addToCart(item.maDichVu)
                            }
                            className="w-7 h-7 bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-green-400" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            addToCart(item.maDichVu)
                          }
                          className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm">
                Số dư hiện tại
              </p>
              <p className="text-white">
                {balance.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">
                Tổng đơn hàng ({cartItemCount} món)
              </p>
              <p
                className={`text-2xl ${isInsufficientBalance ? "text-red-400" : "text-orange-400"}`}
              >
                {total.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          {isInsufficientBalance && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">
                Số dư không đủ. Vui lòng nạp thêm tiền hoặc giảm
                số lượng món.
              </p>
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={
              cartItemCount === 0 || isInsufficientBalance
            }
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {cartItemCount === 0
              ? "Chọn món để đặt hàng"
              : "Xác nhận đặt hàng"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}