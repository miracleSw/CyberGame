import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { HoaDon } from "../types";

interface OrdersPanelProps {
  orders: HoaDon[];
  isOpen: boolean;
}

export function OrdersPanel({
  orders,
  isOpen,
}: OrdersPanelProps) {
  if (!isOpen || orders.length === 0) return null;

  const getStatusConfig = (trangThai: number) => {
    switch (trangThai) {
      case 0:
        return {
          icon: Clock,
          color: "yellow",
          label: "Đang chuẩn bị",
        };
      case 1:
        return {
          icon: CheckCircle,
          color: "green",
          label: "Hoàn thành",
        };
      default:
        return { icon: XCircle, color: "red", label: "Đã huỷ" };
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl overflow-hidden border border-white/20"
      >
        <div className="bg-orange-500/20 p-3 flex justify-between">
          <span className="text-white flex gap-2">
            <ShoppingBag /> Đơn hàng của bạn
          </span>
          <span className="bg-orange-500 rounded-full px-2 text-xs">
            {orders.length}
          </span>
        </div>
        <div className="max-h-[200px] overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {orders.map((order) => {
              const config = getStatusConfig(order.trangThai);
              const Icon = config.icon;
              return (
                <motion.div
                  key={order.maHoaDon}
                  className="bg-white/5 rounded-lg p-2"
                >
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span
                      className={`text-${config.color}-400 flex gap-1`}
                    >
                      <Icon size={12} /> {config.label}
                    </span>
                    <span>
                      {order.ngayTao.toLocaleTimeString()}
                    </span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-white text-sm"
                    >
                      <span>
                        {item.tenDichVu} x{item.soLuong}
                      </span>
                      <span>
                        {(
                          item.donGia * item.soLuong
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-1 pt-1 flex justify-between text-orange-400 font-bold">
                    <span>Tổng</span>
                    <span>
                      {order.tongTien.toLocaleString()}đ
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}