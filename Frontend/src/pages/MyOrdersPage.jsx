import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { fetchOrders } from "../api/profile";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white px-5 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full border border-[#d7e1ea] text-[#0F2A44]"
          >
            ←
          </button>
          <h1 className="text-[20px] font-bold text-[#0F2A44]">My Orders</h1>
        </div>

        {loading ? (
          <p className="mt-6 text-[#5f6b76]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-[#d7e1ea] bg-[#f7fafc] p-6 text-center">
            <p className="text-[16px] font-medium text-[#0F2A44]">No orders yet</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/profile/orders/${order.id}`)}
                className="w-full rounded-[22px] border border-[#e8eef3] bg-white p-4 shadow-sm text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-semibold text-[#0F2A44]">
                      {order.order_number}
                    </p>
                    <p className="mt-1 text-[14px] text-[#5f6b76]">
                      {order.items?.length || 0} items
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[16px] font-bold text-[#0F2A44]">
                      ₹{Number(order.total_amount).toFixed(0)}
                    </p>
                    <p className="mt-1 text-[13px] text-[#00A6ED] capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </MobileFrame>
  );
}