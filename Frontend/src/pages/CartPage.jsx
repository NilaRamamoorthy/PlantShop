import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import BottomNav from "../components/BottomNav";
import { clearCart, fetchCart, removeCartItem, updateCartItem } from "../api/cart";
import { useToast } from "../components/ToastProvider";
import { useCartStore } from "../store/cartStore";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80";

export default function CartPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setCartCountFromCart = useCartStore((s) => s.setCartCountFromCart);

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      setCart(data);
      setCartCountFromCart(data);
    } catch (error) {
      console.error("Failed to load cart", error);
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleIncrease = async (item) => {
    try {
      const res = await updateCartItem(item.id, item.quantity + 1);
      setCart(res.cart);
      setCartCountFromCart(res.cart);
      showToast("Quantity updated");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to update quantity", "error");
    }
  };

  const handleDecrease = async (item) => {
    try {
      const res = await updateCartItem(item.id, item.quantity - 1);
      setCart(res.cart);
      setCartCountFromCart(res.cart);
      showToast(item.quantity - 1 < 1 ? "Item removed" : "Quantity updated");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to update quantity", "error");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const res = await removeCartItem(itemId);
      setCart(res.cart);
      setCartCountFromCart(res.cart);
      showToast("Item removed");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to remove item", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await clearCart();
      setCart(res.cart);
      setCartCountFromCart(res.cart);
      showToast("Cart cleared");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to clear cart", "error");
    }
  };

  const items = cart?.items || [];

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white flex flex-col">
        <div className="flex-1 px-5 pt-8 pb-28">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[20px] font-bold text-[#0F2A44]">My Cart</h1>

            {items.length > 0 ? (
              <button
                onClick={handleClearCart}
                className="text-[14px] font-medium text-[#45AE48]"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {loading ? (
            <p className="mt-6 text-[#5f6b76]">Loading cart...</p>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#dbe7dc] bg-[#f7faf8] p-6 text-center">
              <p className="text-[16px] font-medium text-[#0F2A44]">
                Your cart is empty
              </p>
              <p className="mt-2 text-[14px] text-[#5f6b76]">
                Add some plants to continue.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="mt-5 rounded-full bg-[#45AE48] px-5 py-3 text-[14px] font-semibold text-white"
              >
                Browse Plants
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[#dbe7dc] bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <button onClick={() => navigate(`/plants/${item.plant.slug}`)}>
                        <img
                          src={item.plant.primary_image || fallbackPlantImage}
                          alt={item.plant.name}
                          className="w-20 h-20 rounded-[16px] object-cover bg-[#f4f8fb]"
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate(`/plants/${item.plant.slug}`)}
                          className="text-left"
                        >
                          <p className="text-[16px] font-semibold text-[#0F2A44]">
                            {item.plant.name}
                          </p>
                        </button>

                        <p className="mt-1 text-[14px] text-[#5f6b76]">
                          ₹{Number(item.unit_price).toFixed(0)} each
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="flex items-center rounded-full border border-[#dbe7dc] overflow-hidden">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="px-4 py-2 text-[#0F2A44]"
                            >
                              −
                            </button>
                            <span className="px-4 text-[14px] font-semibold text-[#0F2A44]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="px-4 py-2 text-[#0F2A44]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-[14px] font-medium text-[#45AE48]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#eef3f7] pt-4">
                      <p className="text-[14px] text-[#5f6b76]">Item total</p>
                      <p className="text-[16px] font-bold text-[#0F2A44]">
                        ₹{Number(item.line_total).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] bg-[#f8fbfd] border border-[#dbe7dc] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-[#5f6b76]">Subtotal</p>
                  <p className="text-[16px] font-semibold text-[#0F2A44]">
                    ₹{Number(cart.subtotal).toFixed(0)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[14px] text-[#5f6b76]">Shipping</p>
                  <p className="text-[16px] font-semibold text-[#0F2A44]">
                    ₹{Number(cart.shipping_fee).toFixed(0)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#dbe7dc] pt-4">
                  <p className="text-[16px] font-semibold text-[#0F2A44]">Total</p>
                  <p className="text-[20px] font-bold text-[#0F2A44]">
                    ₹{Number(cart.total).toFixed(0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout/address")}
                className="mt-6 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}