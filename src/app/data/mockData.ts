// Định nghĩa lại Type theo Database Schema mới

// 1. KhachHang (CUSTOMER)
export interface KhachHang {
    maKhachHang: string;
    tenDangNhap: string;
    matKhau: string;
    soDu: number; // Trong JS/TS dùng number cho số
  }
  
  // 2. MayTinh (PC)
  export interface MayTinh {
    maMay: string;
    trangThai: number; // 0: Trống, 1: Đang chơi, 2: Hỏng/Bảo trì, 3: Đã đặt trước
    viTri: string;
  }
  
  // 3. DichVu (SERVICE)
  export interface DichVu {
    maDichVu: string;
    ten: string;
    gia: number;
    loaiDichVu: "đồ ăn" | "thức uống" | "thẻ nạp" | "khác";
    // Các trường bổ sung cho UI (Frontend cần để hiển thị ảnh/tình trạng)
    image: string;
    available: boolean;
  }
  
  // --- MOCK DATA (Dữ liệu giả lập đã đổi tên) ---
  
  // Mock users database -> KhachHang
  export const MOCK_USERS: KhachHang[] = [
    {
      maKhachHang: "1",
      tenDangNhap: "user001",
      matKhau: "123456",
      soDu: 50000,
    },
    {
      maKhachHang: "2",
      tenDangNhap: "user002",
      matKhau: "123456",
      soDu: 5000,
    },
    {
      maKhachHang: "3",
      tenDangNhap: "user003",
      matKhau: "123456",
      soDu: 0,
    },
  ];
  
  // Mock PCs -> MayTinh
  // Lưu ý: trangThai chuyển từ string sang int (0, 1, 2)
  export const PCS: MayTinh[] = [
    { maMay: "PC-01", trangThai: 0, viTri: "Tầng 1 - Dãy A" },
    { maMay: "PC-02", trangThai: 1, viTri: "Tầng 1 - Dãy A" },
    { maMay: "PC-03", trangThai: 0, viTri: "Tầng 1 - Dãy A" },
    { maMay: "PC-04", trangThai: 3, viTri: "Tầng 1 - Dãy A" },
    { maMay: "PC-05", trangThai: 0, viTri: "Tầng 1 - Dãy A" },
    { maMay: "PC-06", trangThai: 1, viTri: "Tầng 1 - Dãy B" },
    { maMay: "PC-07", trangThai: 1, viTri: "Tầng 1 - Dãy B" },
    { maMay: "PC-08", trangThai: 0, viTri: "Tầng 1 - Dãy B" },
    { maMay: "PC-09", trangThai: 3, viTri: "Tầng 1 - Dãy B" },
    { maMay: "PC-10", trangThai: 1, viTri: "Tầng 1 - Dãy B" },
    {
      maMay: "PC-11",
      trangThai: 0,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-12",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    }, // Occupied -> 1
    {
      maMay: "PC-13",
      trangThai: 0,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-14",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-15",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-16",
      trangThai: 2,
      viTri: "Tầng 2 - Phòng Lạnh",
    }, // Maintenance -> 2
    {
      maMay: "PC-17",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-18",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-19",
      trangThai: 1,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
    {
      maMay: "PC-20",
      trangThai: 0,
      viTri: "Tầng 2 - Phòng Lạnh",
    },
  ];
  
  export const COST_PER_MINUTE = 9800; // VND per minute
  export const MIN_BALANCE_REQUIRED = 5000;
  
  // Mock Service Items -> DichVu
  export const SERVICE_ITEMS: DichVu[] = [
    {
      maDichVu: "s1",
      ten: "Trà sữa truyền thống",
      gia: 25000,
      loaiDichVu: "thức uống",
      image: "bubble tea",
      available: true,
    },
    {
      maDichVu: "s2",
      ten: "Coca Cola",
      gia: 15000,
      loaiDichVu: "thức uống",
      image: "cola drink",
      available: true,
    },
    {
      maDichVu: "s3",
      ten: "Nước lọc",
      gia: 5000,
      loaiDichVu: "thức uống",
      image: "water bottle",
      available: true,
    },
    {
      maDichVu: "s4",
      ten: "Mì tôm trứng",
      gia: 20000,
      loaiDichVu: "đồ ăn",
      image: "instant noodles",
      available: true,
    },
    {
      maDichVu: "s5",
      ten: "Bánh mì thịt",
      gia: 30000,
      loaiDichVu: "đồ ăn",
      image: "vietnamese sandwich with meat",
      available: true,
    },
    {
      maDichVu: "s6",
      ten: "Cơm rang dưa bò",
      gia: 35000,
      loaiDichVu: "đồ ăn",
      image: "fried rice",
      available: true,
    },
    {
      maDichVu: "s7",
      ten: "Snack khoai tây",
      gia: 10000,
      loaiDichVu: "đồ ăn", // Gộp snack vào đồ ăn hoặc tách riêng tuỳ logic
      image: "potato chips",
      available: true,
    },
    {
      maDichVu: "s8",
      ten: "Bánh quy socola",
      gia: 12000,
      loaiDichVu: "đồ ăn",
      image: "chocolate cookies",
      available: true,
    },
    {
      maDichVu: "s9",
      ten: "Sting dâu",
      gia: 12000,
      loaiDichVu: "thức uống",
      image: "red water bottle",
      available: false,
    },
  ];