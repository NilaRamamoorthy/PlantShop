import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { createPaymentMethod, deletePaymentMethod, fetchPaymentMethods } from "../api/profile";

const initialForm = {
  method_type: "card",
  card_holder_name: "",
  card_number: "",
  card_brand: "Visa",
  expiry_month: "",
  expiry_year: "",
  is_default: false,
};

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    try {
      const data = await fetchPaymentMethods();
      setMethods(data || []);
    } catch (error) {
      console.error("Failed to load payment methods", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createPaymentMethod(form);
      setMethods((prev) => [created, ...prev]);
      setForm(initialForm);
      setShowForm(false);
    } catch (error) {
      alert("Failed to save payment method");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethod(id);
      setMethods((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete payment method");
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
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Payment Methods</h1>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mt-6 w-full rounded-full border border-[#0F2A44] py-3 text-[16px] font-semibold text-[#0F2A44]"
        >
          {showForm ? "Hide Form" : "Add Card"}
        </button>

        {showForm ? (
          <form onSubmit={handleCreate} className="mt-5 space-y-3">
            <input
              type="text"
              placeholder="Card Holder Name"
              value={form.card_holder_name}
              onChange={(e) => setForm({ ...form, card_holder_name: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              value={form.card_number}
              onChange={(e) => setForm({ ...form, card_number: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
              required
            />
            <input
              type="text"
              placeholder="Card Brand"
              value={form.card_brand}
              onChange={(e) => setForm({ ...form, card_brand: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM"
                value={form.expiry_month}
                onChange={(e) => setForm({ ...form, expiry_month: e.target.value })}
                className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
                required
              />
              <input
                type="text"
                placeholder="YYYY"
                value={form.expiry_year}
                onChange={(e) => setForm({ ...form, expiry_year: e.target.value })}
                className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
                required
              />
            </div>

            <label className="flex items-center gap-2 text-[14px] text-[#0F2A44]">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              />
              Set as default
            </label>

            <button className="w-full rounded-full bg-[#00A6ED] py-3 text-white font-semibold">
              Save Card
            </button>
          </form>
        ) : null}

        <div className="mt-6 space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="rounded-[22px] border border-[#e8eef3] bg-white p-4 shadow-sm"
            >
              <p className="text-[16px] font-semibold text-[#0F2A44]">
                {method.method_type === "card"
                  ? `${method.card_brand || "Card"} **** ${method.card_last4}`
                  : method.method_type.replace("_", " ").toUpperCase()}
                {method.is_default ? " (Default)" : ""}
              </p>

              {method.method_type === "card" ? (
                <p className="mt-1 text-[14px] text-[#5f6b76]">
                  {method.card_holder_name} · {method.expiry_month}/{method.expiry_year}
                </p>
              ) : null}

              <button
                onClick={() => handleDelete(method.id)}
                className="mt-4 text-[14px] font-medium text-[#00A6ED]"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}