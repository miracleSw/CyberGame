import { Monitor, Wrench, Lock } from "lucide-react";
import type { MayTinh } from "../types";

interface PCSelectorProps {
  pcs: MayTinh[];
  onSelect: (maMay: string) => void;
}

export function PCSelector({ pcs, onSelect }: PCSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h2 className="text-white text-center text-4xl mb-6">
          Chọn máy trống
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pcs.map((pc) => {
            // Logic mới: trangThai === 0 là Trống (Available)
            const disabled = pc.trangThai !== 0;

            return (
              <button
                key={pc.maMay}
                disabled={disabled}
                onClick={() => onSelect(pc.maMay)}
                title={pc.viTri}
                className={`rounded-xl p-6 border transition text-center relative group
                  ${
                    disabled
                      ? "bg-white/5 border-white/10 cursor-not-allowed opacity-50"
                      : "bg-white/10 hover:bg-white/20 border-white/20"
                  }
                `}
              >
                <Monitor className="mx-auto mb-2 text-white w-12 h-10" />
                <p className="text-white text-xl font-bold">
                  {pc.maMay}
                </p>
                <p className="text-white/40 text-base truncate">
                  {pc.viTri}
                </p>

                <div className="mt-2 text-base text-white/70 flex justify-center gap-1 items-center">
                  {pc.trangThai === 0 && (
                    <span className="text-green-400 font-bold">
                      Trống
                    </span>
                  )}
                  {pc.trangThai === 1 && (
                    <>
                      <Lock className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 font-bold">
                        Đang dùng
                      </span>
                    </>
                  )}
                  {pc.trangThai === 2 && (
                    <>
                      <Wrench className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">
                        Bảo trì
                      </span>
                    </>
                  )}
                  {pc.trangThai === 3 && (
                    <>
                      <Wrench className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">
                        Đã đặt trước
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}