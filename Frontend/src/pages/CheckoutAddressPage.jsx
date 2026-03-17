import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import CheckoutSteps from "../components/CheckoutSteps";
import { createAddress, fetchAddresses } from "../api/checkout";
import { useToast } from "../components/ToastProvider";

const initialForm = {
  label: "Home",
  full_name: "",
  phone_number: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: true,
};

export default function CheckoutAddressPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await fetchAddresses();
      setAddresses(data || []);
      const defaultAddress = data.find((item) => item.is_default) || data[0];
      if (defaultAddress) setSelectedId(String(defaultAddress.id));
    } catch (error) {
      showToast("Failed to load addresses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await createAddress(form);
      setAddresses((prev) => [created, ...prev]);
      setSelectedId(String(created.id));
      setShowForm(false);
      setForm(initialForm);
      showToast("Address added");
    } catch (error) {
      showToast("Failed to save address", "error");
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      showToast("Please select an address", "error");
      return;
    }
    navigate("/checkout/payment", { state: { addressId: Number(selectedId) } });
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-[#efefef] px-4 pb-8 flex flex-col">
        <CheckoutSteps current="location" />

        <div className="mt-8 flex-1">
          {loading ? (
            <p className="text-[#5f6b76]">Loading addresses...</p>
          ) : (
            <div className="space-y-6">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={String(address.id) === selectedId}
                    onChange={() => setSelectedId(String(address.id))}
                    className="mt-1 accent-[#45AE48]"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[16px] font-semibold text-black">
                        {address.label}
                      </p>
                      <button className="text-[#7d7d7d] text-[22px] leading-none">
                        ⋮
                      </button>
                    </div>

                    <p className="mt-2 text-[13px] leading-5 text-[#8a8a8a]">
                      {address.address_line_1}
                      {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                      , {address.city}, {address.state}, {address.postal_code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="mt-8 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]"
          >
            {showForm ? "Hide Form" : "Add New Address"}
          </button>

          {showForm ? (
            <form onSubmit={handleCreateAddress} className="mt-6 space-y-3">
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
              >
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>

              {[
                ["full_name", "Full Name"],
                ["phone_number", "Phone Number"],
                ["address_line_1", "Address Line 1"],
                ["address_line_2", "Address Line 2"],
                ["city", "City"],
                ["state", "State"],
                ["postal_code", "Postal Code"],
                ["country", "Country"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3 bg-white"
                  required={key !== "address_line_2"}
                />
              ))}

              <label className="flex items-center gap-2 text-[14px] text-[#0F2A44]">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                />
                Set as default
              </label>

              <button className="w-full rounded-full bg-[#45AE48] py-3 text-white font-semibold">
                Save Address
              </button>
            </form>
          ) : null}
        </div>

        <button
          onClick={handleContinue}
          className="mt-6 w-full rounded-full bg-[#45AE48] py-4 text-[16px] font-semibold text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]"
        >
          Continue
        </button>
      </div>
    </MobileFrame>
  );
}