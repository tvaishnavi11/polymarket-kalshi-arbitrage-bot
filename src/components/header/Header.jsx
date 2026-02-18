import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
// import { useCart } from "../../contexts/CartContext";
// import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { getTotalItems, toggleCart } = useCart();
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header
        className={`w-full flex justify-center bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0 z-50" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-16 px-6">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-serif text-gray-900">
            FashionShop
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8">
            <Link to="/men" className="text-sm text-gray-600 hover:text-black">
              Men
            </Link>
            <Link
              to="/women"
              className="text-sm text-gray-600 hover:text-black"
            >
              Women
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {isAuth ? (
              <div className="flex gap-4">
                <span>Hello, {user.name}</span>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/signup")}>Signup</button>
              </div>
            )}

            {/* CART */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-black"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button onClick={() => navigate("/account")}>My Account</button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 p-6">
          <div className="flex flex-col gap-6">
            <Link to="/men" onClick={() => setIsMobileMenuOpen(false)}>
              Men
            </Link>
            <Link to="/women" onClick={() => setIsMobileMenuOpen(false)}>
              Women
            </Link>

            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
