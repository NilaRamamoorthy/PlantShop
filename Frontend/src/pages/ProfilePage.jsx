import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import BottomNav from "../components/BottomNav";
import { logoutUser } from "../utils/auth";
import { useWishlistStore } from "../store/wishlistStore";
const menuItems = [
  {
    title: "Edit Profile",
    subtitle: "Update your personal details",
    path: "/profile/edit",
  },
  {
    title: "My Orders",
    subtitle: "Track placed orders",
    path: "/profile/orders",
  },
  {
    title: "Saved Addresses",
    subtitle: "Manage delivery locations",
    path: "/profile/addresses",
  },
  {
    title: "Payment Methods",
    subtitle: "Cards and payment options",
    path: "/profile/payments",
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const resetWishlist = useWishlistStore((s) => s.resetWishlist);
 const handleLogout = () => {
  logoutUser();
  resetWishlist();
  navigate("/login", { replace: true });
};

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white flex flex-col">
        <div className="flex-1 px-5 pt-8 pb-24">
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Profile</h1>

          <div className="mt-6 rounded-[26px] bg-[#0F2A44] p-5 text-white">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[24px] font-semibold">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>

            <p className="mt-4 text-[20px] font-semibold">
              {user.full_name || "User"}
            </p>
            <p className="mt-1 text-[14px] text-white/80">
              {user.email || "No email"}
            </p>
            <p className="mt-1 text-[14px] text-white/80">
              {user.phone_number || "No phone number"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="w-full rounded-[22px] border border-[#e8eef3] bg-white p-4 shadow-sm text-left"
              >
                <p className="text-[16px] font-semibold text-[#0F2A44]">
                  {item.title}
                </p>
                <p className="mt-1 text-[14px] text-[#5f6b76]">
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white"
          >
            Logout
          </button>
        </div>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}