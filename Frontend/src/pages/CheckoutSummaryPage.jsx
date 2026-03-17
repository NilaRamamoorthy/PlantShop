import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import CheckoutSteps from "../components/CheckoutSteps";
import { placeOrder, previewCheckout } from "../api/checkout";
import { useToast } from "../components/ToastProvider";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80";

export default function CheckoutSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const addressId = location.state?.addressId;
  const paymentMethodId = location.state?.paymentMethodId;

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!addressId || !paymentMethodId) {
      navigate("/checkout/address");
      return;
    }
    loadPreview();
  }, [addressId, paymentMethodId]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      const data = await previewCheckout({
        address_id: addressId,
        payment_method_id: paymentMethodId,
      });
      setPreview(data);
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to load summary", "error");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      const res = await placeOrder({
        address_id: addressId,
        payment_method_id: paymentMethodId,
      });
      navigate("/checkout/success", { state: { order: res.order } });
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-[#efefef] px-4 pb-8 flex flex-col">
        <CheckoutSteps
          current="summary"
          showBack
          onBack={() => navigate("/checkout/payment", { state: { addressId } })}
        />

        {loading || !preview ? (
          <p className="mt-8 text-[#5f6b76]">Loading summary...</p>
        ) : (
          <>
            <div className="mt-8 space-y-4 flex-1">
              {preview.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[#dbe7dc] bg-white p-4 flex gap-4"
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

            <div className="mt-6 rounded-[24px] bg-white border border-[#dbe7dc] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#5f6b76]">Subtotal</p>
                <p className="text-[16px] font-semibold text-[#0F2A44]">
                  ₹{Number(preview.subtotal).toFixed(0)}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[14px] text-[#5f6b76]">Shipping</p>
                <p className="text-[16px] font-semibold text-[#0F2A44]">
                  ₹{Number(preview.shipping_fee).toFixed(0)}
                </p>
              </div>
              <div className="mt-4 border-t border-[#dbe7dc] pt-4 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-[#0F2A44]">Total</p>
                <p className="text-[20px] font-bold text-[#0F2A44]">
                  ₹{Number(preview.total).toFixed(0)}
                </p>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="mt-6 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]"
            >
              {placing ? "Placing Order..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </MobileFrame>
  );
}