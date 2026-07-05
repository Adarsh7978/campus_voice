import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return Boolean(localStorage.getItem("token"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    } catch {
      setIsAuthenticated(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // Ignore storage errors and still navigate away.
    }

    setIsAuthenticated(false);
    navigate("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { to: "/", label: "Dashboard", end: true },
        { to: "/create", label: "Create Issue" },
      ]
    : [
        { to: "/", label: "Dashboard", end: true },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ];

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            CV
          </div>
          <span className="text-base font-semibold text-gray-900">
            Campus Voice
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
