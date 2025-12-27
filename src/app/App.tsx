import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

// Components
import { LoginScreen } from "./components/LoginScreen";
import { SessionDashboard } from "./components/SessionDashboard";
import { ServicesModal } from "./components/ServicesModal";
import {
  TopUpModal,
  TopUpStatus,
} from "./components/TopUpModal";
import { OrdersPanel } from "./components/OrdersPanel";
import { PCSelector } from "./components/PCSelector";

// Types & Data
import type { 
  KhachHang, 
  PhienChoi, 
  HoaDon, 
  LichSuGiaoDich, 
  MayTinh 
} from "./types";
import {
  COST_PER_MINUTE,
  PCS as INITIAL_PCS,
} from "./data/mockData";

export default function App() {
  // State User & Session
  const [user, setUser] = useState<KhachHang | null>(null);
  const [session, setSession] = useState<PhienChoi | null>(
    null,
  );
  const [selectedPC, setSelectedPC] = useState<string | null>(
    null,
  );

  // State Data
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState<HoaDon[]>([]);
  const [topUpRequests, setTopUpRequests] = useState<
    LichSuGiaoDich[]
  >([]);
  const [pcs, setPcs] = useState<MayTinh[]>(INITIAL_PCS);

  // Modals
  const [showServicesModal, setShowServicesModal] =
    useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // 1. Timer: Cập nhật thời gian chơi mỗi giây
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          // timeElapsed là trường UI (không có trong DB) để đếm giây
          timeElapsed: (prev.timeElapsed || 0) + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  // 2. Simulation: Admin duyệt nạp tiền (Sau 5s)
  useEffect(() => {
    // Lọc các yêu cầu có trangThai = 0 (Chờ duyệt)
    const pendingRequests = topUpRequests.filter(
      (req) => req.trangThai === 0,
    );

    if (pendingRequests.length === 0) return;

    const timers = pendingRequests.map((req) => {
      return setTimeout(() => {
        // Random duyệt (90% thành công)
        const isApproved = Math.random() > 0.1;

        setTopUpRequests((prev) =>
          prev.map((r) =>
            r.maGiaoDich === req.maGiaoDich
              ? {
                  ...r,
                  trangThai: isApproved ? 1 : 2, // 1: Thành công, 2: Hủy
                }
              : r,
          ),
        );

        if (isApproved) {
          setBalance((prev) => prev + req.soTien);
          toast.success(
            `Nạp tiền thành công! +${req.soTien.toLocaleString("vi-VN")}đ`,
            { duration: 3000 },
          );
        } else {
          toast.error(
            "Yêu cầu nạp tiền bị từ chối. Vui lòng liên hệ quầy.",
            { duration: 3000 },
          );
        }
      }, 5000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [topUpRequests]);

  // 3. Simulation: Bếp làm xong đồ ăn (10-20s)
  useEffect(() => {
    // Lọc đơn hàng trangThai = 0 (Chưa thanh toán/Đang xử lý)
    const pendingOrders = orders.filter(
      (order) => order.trangThai === 0,
    );

    if (pendingOrders.length === 0) return;

    const timers = pendingOrders.map((order) => {
      return setTimeout(
        () => {
          // Random hoàn thành (95%)
          const isCompleted = Math.random() > 0.05;

          if (isCompleted) {
            setOrders((prev) =>
              prev.map((o) =>
                o.maHoaDon === order.maHoaDon
                  ? { ...o, trangThai: 1 } // 1: Đã thanh toán/Hoàn thành
                  : o,
              ),
            );
            toast.success(
              "Đơn hàng đã hoàn thành! Vui lòng nhận tại quầy.",
              { duration: 3000 },
            );
          } else {
            // Hủy đơn -> Hoàn tiền (Logic giả lập)
            setBalance((prev) => prev + order.tongTien);
            setOrders((prev) =>
              prev.filter((o) => o.maHoaDon !== order.maHoaDon),
            );
            toast.error(
              `Hết món! Đã hoàn ${order.tongTien.toLocaleString("vi-VN")}đ vào tài khoản.`,
              { duration: 3000 },
            );
          }
        },
        Math.random() * 10000 + 10000,
      );
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [orders]);

  // --- HANDLERS ---

  const handleLogin = (userData: KhachHang) => {
    if (!userData) return;

    setUser(userData);
    setBalance(userData.soDu);

    // 🔒 Khoá PC: trangThai -> 1 (Đang chơi)
    setPcs((prev) =>
      prev.map((pc) =>
        pc.maMay === userData.maMayHienTai
          ? { ...pc, trangThai: 1 }
          : pc,
      ),
    );

    // Tạo phiên chơi mới
    const newSession: PhienChoi = {
      maPhien: `session-${Date.now()}`,
      maKhachHang: userData.maKhachHang,
      maMay: userData.maMayHienTai || "",
      thoiGianBatDau: new Date(),
      timeElapsed: 0,
      costPerMinute: COST_PER_MINUTE,
      tongTien: 0,
      trangThai: 1, // Đang chơi
    };

    setSession(newSession);
    toast.success(`Chào mừng ${userData.tenDangNhap}!`, {
      duration: 2000,
    });
  };

  const handlePasswordChange = (
    oldPassword: string,
    newPassword: string,
  ) => {
    if (!user) return false;

    if (user.matKhau !== oldPassword) {
      toast.error("Mật khẩu cũ không đúng!");
      return false;
    }

    setUser({ ...user, matKhau: newPassword });
    toast.success("Đổi mật khẩu thành công!");
    return true;
  };

  const handleLogout = () => {
    if (session) {
      const sessionDuration = Math.floor(
        (session.timeElapsed || 0) / 60,
      );
      toast.info(
        `Phiên chơi kết thúc. Thời gian: ${sessionDuration} phút. Số dư còn: ${balance.toLocaleString("vi-VN")}đ`,
        { duration: 3000 },
      );
    }

    // Reset State
    setUser(null);
    setSession(null);
    setBalance(0);
    setOrders([]);
    setTopUpRequests([]);
    setSelectedPC(null);

    // Mở khóa PC: trangThai -> 0 (Trống)
    setPcs((prev) =>
      prev.map((pc) =>
        pc.maMay === user?.maMayHienTai
          ? { ...pc, trangThai: 0 }
          : pc,
      ),
    );
  };

  const handleOrderComplete = (newOrder: HoaDon) => {
    // Trừ tiền ngay khi đặt (Pre-paid logic)
    setBalance((prev) => prev - newOrder.tongTien);
    setOrders((prev) => [...prev, newOrder]);
    toast.success("Đơn hàng đã được gửi! Đang chuẩn bị...", {
      duration: 2000,
    });
  };

  const handleTopUpRequest = (request: LichSuGiaoDich) => {
    setTopUpRequests((prev) => [...prev, request]);
    toast.info(
      "Yêu cầu nạp tiền đã được gửi. Vui lòng chờ admin duyệt.",
      { duration: 2000 },
    );
    setShowTopUpModal(false);
  };

  // --- RENDER ---

  // Màn hình chọn máy & Đăng nhập
  if (!user || !session) {
    return (
      <>
        {/* {!selectedPC ? (
          <PCSelector
            pcs={pcs}
            onSelect={(maMay) => setSelectedPC(maMay)}
          />
        ) : (
          <LoginScreen
            machineId={selectedPC}
            onLogin={handleLogin}
            onBack={() => setSelectedPC(null)}
          />
        )} */}

        <LoginScreen
          machineId="PC-01"
          onLogin={handleLogin}
          onBack={() => setSelectedPC(null)}
        />

        <Toaster closeButton position="top-right" />
      </>
    );
  }

  // Màn hình Dashboard (Đang chơi)
  return (
    <>
      <SessionDashboard
        session={session}
        balance={balance}
        orders={orders}
        username={user.tenDangNhap}
        machineId={user.maMayHienTai || ""}
        onBalanceUpdate={setBalance}
        onOpenServices={() => setShowServicesModal(true)}
        onOpenTopUp={() => setShowTopUpModal(true)}
        onPasswordChange={handlePasswordChange}
        onLogout={handleLogout}
      />

      <ServicesModal
        isOpen={showServicesModal}
        onClose={() => setShowServicesModal(false)}
        balance={balance}
        currentUser={{
          maKhachHang: user.maKhachHang,
          maPhien: session.maPhien,
        }}
        onOrderComplete={handleOrderComplete}
      />

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        balance={balance}
        maKhachHang={user.maKhachHang}
        onTopUpRequest={handleTopUpRequest}
      />

      {/* <OrdersPanel orders={orders} isOpen={orders.length > 0} /> */}

      {/* {topUpRequests.map((request) => (
        <TopUpStatus
          key={request.maGiaoDich}
          request={request}
          onClose={() => {
            setTopUpRequests((prev) =>
              prev.filter(
                (r) => r.maGiaoDich !== request.maGiaoDich,
              ),
            );
          }}
        />
      ))} */}

      <Toaster closeButton position="top-right" />
    </>
  );
}
