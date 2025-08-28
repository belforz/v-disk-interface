import { Link, NavLink } from "react-router-dom";
import { useCart } from "@app/store/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faCompactDisc } from "@fortawesome/free-solid-svg-icons";

export function Header() {
  const count = useCart(s => s.count());
  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <a className="nav-link" href="#">Disks</a>
          <a className="nav-link" href="#">Artists</a>
        </div>

        <Link to="/" className="text-white">
          <FontAwesomeIcon icon={faCompactDisc} size="lg" className="text-xl" />
        </Link>

        <div className="flex items-center gap-6">
          <a className="nav-link" href="#">Location</a>
          <a className="nav-link" href="#">Notes</a>
          <a className="nav-link" href="#">Login</a>

          <Link to="/cart" className="relative nav-link">
            <FontAwesomeIcon icon={faBagShopping} className="mr-2" />
            Bag
            {count > 0 && (
              <span className="absolute -right-5 -top-0.5 text-[10px] bg-white text-black rounded-full px-1.5 py-0.6">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
