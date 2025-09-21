import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartFacade } from "@app/hooks/useCartFacade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCompactDisc,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@app/hooks/useAuth";
import { useOrder } from "@app/hooks";
import { notify } from "@app/lib/toast";

export function Header() {
  const { items } = useCartFacade();
  const count = (items || []).reduce((acc, it: any) => acc + (it.qty ?? 0), 0);
  const { user, logout } = useAuth();
  const { orders } = useOrder();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      notify.success("Logged out");
      navigate("/");
    } catch (err) {
      notify.error("Failed to log out");
    }
  }

  const redirectToPanel = () => {
    const roles = user?.roles;
    const isAdmin = Array.isArray(roles) ? roles.includes('ADMIN') : roles === 'ADMIN';
    if (isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/user");
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/history" className="nav-link">
            History
          </NavLink>
          <NavLink to="/artists" className="nav-link">
            Artists
          </NavLink>

          <button onClick={redirectToPanel} className="nav-link">Dashboard</button>
        </div>

        <Link to="/" className="text-white">
          <FontAwesomeIcon icon={faCompactDisc} className="text-2xl" />
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/location" className="nav-link">
            Location
          </NavLink>

          {user ? (
            <button onClick={handleLogout} className="relative nav-link text-sm">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Logout
            </button>
          ) : (
            <Link to="/login" className="relative nav-link hover:">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Login
            </Link>
          )}

          <Link to="/cart" className="relative nav-link">
            <FontAwesomeIcon icon={faBagShopping} className="mr-2" />
            Bag
            {count > 0 && (
              <span className="absolute -right-5 -top-0.5 text-[10px] bg-white text-black rounded-full px-1.5 py-0.6">
                {count}
              </span>
            )}
          </Link>

          {/* <a className="nav-link" href="#">Notes</a> */}

          {/* <Link to="/cart" className="relative nav-link">
            <FontAwesomeIcon icon={faBagShopping} className="mr-2" />
            Bag
            {count > 0 && (
              <span className="absolute -right-5 -top-0.5 text-[10px] bg-white text-black rounded-full px-1.5 py-0.6">
                {count}
              </span>
            )}
          </Link> */}
        </div>
      </nav>
    </header>
  );
}
