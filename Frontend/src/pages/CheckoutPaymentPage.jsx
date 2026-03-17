import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { createPaymentMethod, fetchPaymentMethods } from "../api/checkout";
import { useToast } from "../components/ToastProvider";

const initialCardForm = {
  method_type: "card",
  card_holder_name: "",
  card_number: "",
  card_brand: "Visa",
  expiry_month: "",
  expiry_year: "",
  is_default: true,
};

export default function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const addressId = location.state?.addressId;

  const [methods, setMethods] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [form, setForm] = useState(initialCardForm);

  useEffect(() => {
    if (!addressId) {
      navigate("/checkout/address");
      return;
    }
    loadMethods();
  }, [addressId]);

  const loadMethods = async () => {
    try {
      const data = await fetchPaymentMethods();
      setMethods(data || []);
      const defaultMethod = data.find((item) => item.is_default) || data[0];
      if (defaultMethod) setSelectedId(String(defaultMethod.id));
    } catch (error) {
      showToast("Failed to load payment methods", "error");
    }
  };

  const quickMethods = [
    { method_type: "cash", label: "Cash", icon: "💵" },
    { method_type: "wallet", label: "Wallet", icon: "👛" },
    { method_type: "paypal", label: "Paypal", icon: "P" },
    { method_type: "apple_pay", label: "Apple Pay", icon: "" },
    { method_type: "google_pay", label: "Google Pay", icon: "G" },
  ];

  const addQuickMethod = async (methodType) => {
    try {
      const created = await createPaymentMethod({
        method_type: methodType,
        is_default: true,
      });
      setMethods((prev) => [created, ...prev]);
      setSelectedId(String(created.id));
      showToast("Payment method saved");
    } catch {
      showToast("Failed to save payment method", "error");
    }
  };

  const saveCard = async (e) => {
    e.preventDefault();
    try {
      const created = await createPaymentMethod(form);
      setMethods((prev) => [created, ...prev]);
      setSelectedId(String(created.id));
      setShowCardForm(false);
      setForm(initialCardForm);
      showToast("Card added");
    } catch {
      showToast("Failed to save card", "error");
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      showToast("Please select a payment method", "error");
      return;
    }

    navigate("/checkout/summary", {
      state: {
        addressId,
        paymentMethodId: Number(selectedId),
      },
    });
  };

  const isSelected = (methodId) => String(methodId) === selectedId;

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-[#efefef] px-4 pb-8 flex flex-col">
        <div className="pt-8">
          <button
            onClick={() => navigate("/checkout/address")}
            className="text-[#45AE48] text-[28px] leading-none"
          >
            ←
          </button>

          <h1 className="mt-2 text-center text-[20px] font-bold text-black">
            Payment Method
          </h1>
        </div>

        <div className="mt-8 flex-1">
          <div>
            <p className="text-[18px] font-semibold text-black mb-3">Cash</p>

            <button
              onClick={() => addQuickMethod("cash")}
              className="w-full border border-[#9f9f9f] bg-[#efefef] px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-[24px]">💵</span>
                <span className="text-[16px] text-black">Cash</span>
              </div>
              <span className="text-[#45AE48] text-[24px]">
                {methods.find((m) => m.method_type === "cash" && isSelected(m.id)) ? "◉" : "◯"}
              </span>
            </button>
          </div>

          <div className="mt-6">
            <p className="text-[18px] font-semibold text-black mb-3">Wallet</p>

            <button
              onClick={() => addQuickMethod("wallet")}
              className="w-full border border-[#9f9f9f] bg-[#efefef] px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-[24px]">👛</span>
                <span className="text-[16px] text-black">Wallet</span>
              </div>
              <span className="text-[#45AE48] text-[24px]">
                {methods.find((m) => m.method_type === "wallet" && isSelected(m.id)) ? "◉" : "◯"}
              </span>
            </button>
          </div>

          <div className="mt-6">
            <p className="text-[18px] font-semibold text-black mb-3">Credit and Debit card</p>

            <button
              onClick={() => setShowCardForm((prev) => !prev)}
              className="w-full border border-[#9f9f9f] bg-[#efefef] px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-[24px]">💳</span>
                <span className="text-[16px] text-black">Add Card</span>
              </div>
              <span className="text-[26px] text-[#7d7d7d]">›</span>
            </button>

            {showCardForm ? (
              <form onSubmit={saveCard} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={form.card_holder_name}
                  onChange={(e) => setForm({ ...form, card_holder_name: e.target.value })}
                  className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={form.card_number}
                  onChange={(e) => setForm({ ...form, card_number: e.target.value })}
                  className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Card Brand"
                  value={form.card_brand}
                  onChange={(e) => setForm({ ...form, card_brand: e.target.value })}
                  className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM"
                    value={form.expiry_month}
                    onChange={(e) => setForm({ ...form, expiry_month: e.target.value })}
                    className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={form.expiry_year}
                    onChange={(e) => setForm({ ...form, expiry_year: e.target.value })}
                    className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                    required
                  />
                </div>

                <button className="w-full rounded-full bg-[#45AE48] py-3 text-white font-semibold">
                  Save Card
                </button>
              </form>
            ) : null}

            {methods.filter((m) => m.method_type === "card").length > 0 ? (
              <div className="mt-4 space-y-3">
                {methods
                  .filter((m) => m.method_type === "card")
                  .map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedId(String(method.id))}
                      className="w-full border border-[#9f9f9f] bg-[#efefef] px-4 py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">💳</span>
                        <span className="text-[16px] text-black">
                          {method.card_brand || "Card"} **** {method.card_last4}
                        </span>
                      </div>
                      <span className="text-[#45AE48] text-[24px]">
                        {isSelected(method.id) ? "◉" : "◯"}
                      </span>
                    </button>
                  ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <p className="text-[18px] font-semibold text-black mb-3">More Payment Option</p>

            {quickMethods
              .filter((m) => !["cash", "wallet"].includes(m.method_type))
              .map((method) => (
                <button
                  key={method.method_type}
                  onClick={() => addQuickMethod(method.method_type)}
                  className="w-full border border-[#9f9f9f] bg-[#efefef] px-4 py-3 flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{method.icon}</span>
                    <span className="text-[16px] text-black">{method.label}</span>
                  </div>
                  <span className="text-[#45AE48] text-[24px]">
                    {methods.find((m) => m.method_type === method.method_type && isSelected(m.id))
                      ? "◉"
                      : "◯"}
                  </span>
                </button>
              ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-6 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]"
        >
          Confirm Payment
        </button>
      </div>
    </MobileFrame>
  );
}