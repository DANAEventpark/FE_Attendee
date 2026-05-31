import { useState } from "react";
import logo from "../../assets/logoevent.png";
import useAuthStore from "@/store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import RoleSelectionModal from "../common/RoleSelectionModal";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionType, setAuthActionType] = useState('login');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const openAuthModal = (type) => {
    setAuthActionType(type);
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('token');
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#173846] text-white shadow-md backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="rounded-2xl bg-white px-2 py-1 shadow-lg">
              <img
                src={logo}
                alt="DANAEventSpark"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-base font-semibold leading-none">DANAEventSpark</p>
              <p className="mt-1 text-[10px] text-white/60 hidden sm:block">
                Khám phá sự kiện trong cộng đồng
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Sự kiện
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-white transition-colors">
                Danh mục
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Về chúng tôi
              </Link>
            </li>
          </ul>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 select-none focus:outline-none hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-medium text-white/90">
                    {user.name}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                  </div>

                </button>

                {showUserDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#173846] border border-white/10 shadow-xl py-1.5 z-20 text-sm animate-in fade-in-50 slide-in-from-top-2 duration-150">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-white"
                      >
                        <User size={15} />
                        Hồ sơ
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-white"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-[#e96a52] text-left font-medium"
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="rounded-xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d75c46] transition-colors shadow-lg shadow-orange-500/20"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-white/10 pt-4 animate-in slide-in-from-top-4 duration-200">
            <ul className="flex flex-col gap-4 text-sm font-medium text-white/80 mb-6">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-white transition-colors"
                >
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-white transition-colors"
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-white transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 py-2 text-[#e96a52] hover:text-[#d75c46] transition-colors font-semibold"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>

            {/* Mobile User Section */}
            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{user.name}</p>
                      <p className="text-xs text-white/50">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-[#e96a52] py-2.5 text-sm font-semibold text-white hover:bg-[#d75c46] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="rounded-xl bg-white/10 border border-white/20 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="rounded-xl bg-[#e96a52] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#d75c46] transition-colors"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <RoleSelectionModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionType={authActionType}
      />
    </header>
  );
}