import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Users, AlertCircle, CheckCircle, Building2 } from 'lucide-react';

/**
 * RegistrationTypeModal
 * BUG-009 Fix: Thêm trường "Tên tổ chức" cho đăng ký nhóm
 * BUG-022 Fix: Nút + tăng, nút − giảm (đã đúng logic)
 */
export default function RegistrationTypeModal({
  isOpen,
  onClose,
  onConfirm,
  eventCapacity = 100,
  approvedSeats = 0,
  isSubmitting = false,
}) {
  const [type, setType] = useState(null);
  const [seats, setSeats] = useState(2);
  const [orgName, setOrgName] = useState(''); // BUG-009
  const [seatError, setSeatError] = useState('');
  const [orgNameError, setOrgNameError] = useState('');

  const maxAllowed = Math.max(1, eventCapacity - approvedSeats - 1);
  const availableSeats = eventCapacity - approvedSeats;

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    setSeatError('');
    setOrgNameError('');
    if (selectedType === 'organization') {
      setSeats(Math.min(2, maxAllowed));
    }
  };

  // BUG-022 Fix: Hàm thay đổi số ghế thuần túy — không đảo chiều
  const handleDecrement = () => {
    setSeats(prev => Math.max(2, (parseInt(prev) || 2) - 1));
    setSeatError('');
  };

  const handleIncrement = () => {
    setSeats(prev => Math.min(maxAllowed, (parseInt(prev) || 2) + 1));
    setSeatError('');
  };

  const handleSeatsChange = (value) => {
    const num = parseInt(value, 10);
    setSeats(isNaN(num) ? '' : num);
    setSeatError('');
  };

  const handleConfirm = () => {
    if (!type) return;

    if (type === 'individual') {
      onConfirm(1);
      return;
    }

    // BUG-009 Fix: Validate tên tổ chức bắt buộc
    if (!orgName.trim()) {
      setOrgNameError('Vui lòng nhập tên tổ chức.');
      return;
    }

    const num = parseInt(seats, 10);
    if (isNaN(num) || num < 2) {
      setSeatError('Số lượng chỗ cho tổ chức phải ít nhất là 2.');
      return;
    }
    if (num >= eventCapacity) {
      setSeatError(`Số ghế phải nhỏ hơn giới hạn đăng ký của sự kiện (${eventCapacity} ghế).`);
      return;
    }
    if (num > availableSeats) {
      setSeatError(`Chỉ còn ${availableSeats} chỗ trống. Vui lòng chọn số lượng nhỏ hơn hoặc bằng ${availableSeats}.`);
      return;
    }
    onConfirm(num);
  };

  const handleClose = () => {
    setType(null);
    setSeats(2);
    setOrgName('');
    setSeatError('');
    setOrgNameError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ animation: 'modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(10px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);     }
          }
        `}</style>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Hình thức đăng ký</h2>
            <p className="text-indigo-200 text-xs mt-0.5">Chọn loại đăng ký phù hợp với bạn</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Type selection cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Cá nhân */}
            <button
              onClick={() => handleTypeSelect('individual')}
              className={`relative flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200 ${
                type === 'individual'
                  ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              {type === 'individual' && (
                <span className="absolute top-2 right-2 text-indigo-500">
                  <CheckCircle size={16} />
                </span>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                type === 'individual' ? 'bg-indigo-100' : 'bg-gray-200'
              }`}>
                <User size={22} className={type === 'individual' ? 'text-indigo-600' : 'text-gray-500'} />
              </div>
              <div className="text-center">
                <p className={`font-semibold text-sm ${type === 'individual' ? 'text-indigo-700' : 'text-gray-700'}`}>
                  Cá nhân
                </p>
                <p className="text-xs text-gray-400 mt-0.5">1 chỗ ngồi</p>
              </div>
            </button>

            {/* Tổ chức */}
            <button
              onClick={() => handleTypeSelect('organization')}
              className={`relative flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200 ${
                type === 'organization'
                  ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100'
                  : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'
              }`}
            >
              {type === 'organization' && (
                <span className="absolute top-2 right-2 text-violet-500">
                  <CheckCircle size={16} />
                </span>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                type === 'organization' ? 'bg-violet-100' : 'bg-gray-200'
              }`}>
                <Users size={22} className={type === 'organization' ? 'text-violet-600' : 'text-gray-500'} />
              </div>
              <div className="text-center">
                <p className={`font-semibold text-sm ${type === 'organization' ? 'text-violet-700' : 'text-gray-700'}`}>
                  Tổ chức
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Nhiều chỗ ngồi</p>
              </div>
            </button>
          </div>

          {/* Seats input — chỉ hiện khi chọn tổ chức */}
          {type === 'organization' && (
            <div
              className="mb-4 overflow-hidden"
              style={{ animation: 'modalIn 0.18s ease both' }}
            >
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                {/* BUG-009 Fix: Trường tên tổ chức bắt buộc */}
                <label className="block text-sm font-semibold text-violet-800 mb-2">
                  Tên tổ chức <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => { setOrgName(e.target.value); setOrgNameError(''); }}
                  placeholder="Nhập tên tổ chức / đơn vị"
                  className="w-full border border-violet-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white mb-3"
                />
                {orgNameError && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mb-2">
                    <AlertCircle size={12} /> {orgNameError}
                  </p>
                )}

                <label className="block text-sm font-semibold text-violet-800 mb-2">
                  Số lượng chỗ đăng ký
                </label>

                {/* Capacity info */}
                <div className="flex items-center gap-1.5 text-xs text-violet-600 mb-3 bg-violet-100 rounded-lg px-3 py-2">
                  <AlertCircle size={13} />
                  <span>
                    Sự kiện có <strong>{eventCapacity}</strong> chỗ · Đã đặt <strong>{approvedSeats}</strong> · Còn trống <strong>{availableSeats}</strong> · Tối đa bạn có thể đặt: <strong>{maxAllowed}</strong>
                  </span>
                </div>

                {/* BUG-022 Fix: Nút − giảm (trái), nút + tăng (phải) */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-9 h-9 rounded-lg bg-white border border-violet-300 text-violet-700 font-bold text-lg hover:bg-violet-100 transition flex items-center justify-center select-none"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={2}
                    max={maxAllowed}
                    value={seats}
                    onChange={(e) => handleSeatsChange(e.target.value)}
                    className="w-20 text-center border border-violet-300 rounded-lg py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-9 h-9 rounded-lg bg-white border border-violet-300 text-violet-700 font-bold text-lg hover:bg-violet-100 transition flex items-center justify-center select-none"
                  >
                    +
                  </button>
                  <span className="text-sm text-violet-600 font-medium">chỗ</span>
                </div>

                {seatError && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {seatError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!type || isSubmitting}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition ${
                !type || isSubmitting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : type === 'individual'
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
                    : 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Đang xử lý...
                </span>
              ) : 'Xác nhận đăng ký'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
