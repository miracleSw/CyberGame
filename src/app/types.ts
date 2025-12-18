// types.ts

export interface KhachHang {
    maKhachHang: string;
    tenDangNhap: string;
    matKhau: string;
    soDu: number;
    maMayHienTai?: string; // Optional: Để UI biết user đang ngồi máy nào
  }
  
  export interface MayTinh {
    maMay: string;
    trangThai: number; // 0: Trống, 1: Đang chơi, 2: Hỏng/Bảo trì
    viTri: string;
  }
  
  export interface PhienChoi {
    maPhien: string;
    maKhachHang: string;
    maMay: string;
    thoiGianBatDau: Date;
    thoiGianKetThuc?: Date;
    tongTien: number;
    trangThai: number; // 1: Đang chơi, 0: Kết thúc
  
    // Các trường bổ trợ cho UI tính toán
    timeElapsed?: number; // giây
    costPerMinute?: number;
  }
  
  export interface DichVu {
    maDichVu: string;
    ten: string;
    gia: number;
    loaiDichVu: "đồ ăn" | "thức uống" | "thẻ nạp" | "khác";
    image: string;
    available: boolean;
  }
  
  export interface ChiTietHoaDon {
    maDVHD: string;
    maHoaDon: string;
    maDichVu: string;
    tenDichVu?: string; // Để hiển thị tên món
    soLuong: number;
    donGia: number;
    thanhTien: number;
    trangThai: "đang xử lý" | "đã hoàn thành" | "đã huỷ";
  }
  
  export interface HoaDon {
    maHoaDon: string;
    maKhachHang: string;
    maPhien?: string;
    items: ChiTietHoaDon[]; // Danh sách món trong đơn
    tongTien: number;
    ngayTao: Date;
    trangThai: number; // 0: Chưa thanh toán, 1: Đã thanh toán
  }
  
  export interface LichSuGiaoDich {
    maGiaoDich: string;
    maKhachHang: string;
    loaiGiaoDich:
      | "NAP_TIEN"
      | "TRU_TIEN_GIO"
      | "TRU_TIEN_DICH_VU";
    soTien: number;
    thoiGian: Date;
    ghiChu?: string;
    trangThai: number; // 0: Chờ duyệt, 1: Thành công, 2: Hủy
  }