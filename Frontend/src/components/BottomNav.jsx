import { NavLink } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const navItems = [
  { label: "Home", to: "/home", icon: "⌂" },
  { label: "Wishlist", to: "/wishlist", icon: "♡" },
  { label: "Cart", to: "/cart", icon: "🛒" },
  { label: "Profile", to: "/profile", icon: "◉" },
];

export default function BottomNav() {
  const cartCount = useCartStore((s) => s.cartCount);

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-[#dbe7dc] bg-white px-5 py-3">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isCart = item.label === "Cart";

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[56px] ${
                  isActive ? "text-[#45AE48]" : "text-[#8a97a5]"
                }`
              }
            >
              <span className="relative text-[22px] leading-none">
                {item.icon}

                {isCart && cartCount > 0 ? (
                  <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#45AE48] text-white text-[10px] flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </span>

              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}