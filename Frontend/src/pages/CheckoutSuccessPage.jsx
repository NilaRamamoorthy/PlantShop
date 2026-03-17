import { useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white px-6 py-10 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#45AE48] flex items-center justify-center text-5xl">
          ✓
        </div>

        <h1 className="mt-8 text-[24px] font-bold text-[#45AE48]">
          Order Successful
        </h1>

        <p className="mt-3 text-[16px] text-[#5f6b76]">
          Your order has been placed successfully.
        </p>

        {order ? (
          <div className="mt-6 rounded-[24px] border border-[#e8eef3] bg-[#f8fbfd] p-5 w-full text-left">
            <p className="text-[14px] text-[#5f6b76]">Order Number</p>
            <p className="mt-1 text-[16px] font-semibold text-[#0F2A44]">
              {order.order_number}
            </p>

            <p className="mt-4 text-[14px] text-[#5f6b76]">Total</p>
            <p className="mt-1 text-[16px] font-semibold text-[#0F2A44]">
              ₹{Number(order.total_amount).toFixed(0)}
            </p>
          </div>
        ) : null}

        <button
          onClick={() => navigate("/home")}
          className="mt-8 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white"
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="mt-4 w-full rounded-full border border-[#45AE48] py-4 text-[16px] font-semibold text-[#0F2A44]"
        >
          Go to Profile
        </button>
      </div>
    </MobileFrame>
  );
}