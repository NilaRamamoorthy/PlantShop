import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { fetchOrderDetail } from "../api/profile";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderDetail(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order detail", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white px-5 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile/orders")}
            className="w-10 h-10 rounded-full border border-[#d7e1ea] text-[#0F2A44]"
          >
            ←
          </button>
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Order Detail</h1>
        </div>

        {loading || !order ? (
          <p className="mt-6 text-[#5f6b76]">Loading order...</p>
        ) : (
          <>
            <div className="mt-6 rounded-[24px] border border-[#e8eef3] p-4">
              <p className="text-[16px] font-semibold text-[#0F2A44]">{order.order_number}</p>
              <p className="mt-2 text-[14px] text-[#5f6b76] capitalize">
                Status: {order.status}
              </p>
              <p className="mt-1 text-[14px] text-[#5f6b76] capitalize">
                Payment: {order.payment_status}
              </p>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#e8eef3] p-4">
              <p className="text-[16px] font-semibold text-[#0F2A44]">Delivery Address</p>
              <p className="mt-2 text-[14px] text-[#0F2A44]">{order.shipping_full_name}</p>
              <p className="mt-1 text-[14px] text-[#5f6b76]">
                {order.shipping_address_line_1}, {order.shipping_address_line_2 ? `${order.shipping_address_line_2}, ` : ""}
                {order.shipping_city}, {order.shipping_state}, {order.shipping_postal_code}, {order.shipping_country}
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[#e8eef3] p-4 flex gap-4"
                >
                  <img
                    src={item.plant_image || fallbackPlantImage}
                    alt={item.plant_name}
                    className="w-20 h-20 rounded-[16px] object-cover bg-[#f4f8fb]"
                  />
                  <div className="flex-1">
                    <p className="text-[16px] font-semibold text-[#0F2A44]">
                      {item.plant_name}
                    </p>
                    <p className="mt-1 text-[14px] text-[#5f6b76]">Qty: {item.quantity}</p>
                    <p className="mt-3 text-[16px] font-bold text-[#0F2A44]">
                      ₹{Number(item.line_total).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-[#f8fbfd] border border-[#e8eef3] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#5f6b76]">Subtotal</p>
                <p className="text-[16px] font-semibold text-[#0F2A44]">
                  ₹{Number(order.subtotal).toFixed(0)}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[14px] text-[#5f6b76]">Shipping</p>
                <p className="text-[16px] font-semibold text-[#0F2A44]">
                  ₹{Number(order.shipping_fee).toFixed(0)}
                </p>
              </div>
              <div className="mt-4 border-t border-[#e8eef3] pt-4 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-[#0F2A44]">Total</p>
                <p className="text-[20px] font-bold text-[#0F2A44]">
                  ₹{Number(order.total_amount).toFixed(0)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  );
}