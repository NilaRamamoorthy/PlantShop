import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { createAddress, deleteAddress, fetchAddresses } from "../api/profile";

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
  is_default: false,
};

export default function SavedAddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error("Failed to load addresses", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createAddress(form);
      setAddresses((prev) => [created, ...prev]);
      setForm(initialForm);
      setShowForm(false);
    } catch (error) {
      alert("Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete address");
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
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Saved Addresses</h1>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mt-6 w-full rounded-full border border-[#0F2A44] py-3 text-[16px] font-semibold text-[#0F2A44]"
        >
          {showForm ? "Hide Form" : "Add Address"}
        </button>

        {showForm ? (
          <form onSubmit={handleCreate} className="mt-5 space-y-3">
            <select
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
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
                className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-3"
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

            <button className="w-full rounded-full bg-[#00A6ED] py-3 text-white font-semibold">
              Save Address
            </button>
          </form>
        ) : null}

        <div className="mt-6 space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-[22px] border border-[#e8eef3] bg-white p-4 shadow-sm"
            >
              <p className="text-[16px] font-semibold text-[#0F2A44]">
                {address.label} {address.is_default ? "(Default)" : ""}
              </p>
              <p className="mt-2 text-[14px] text-[#0F2A44]">{address.full_name}</p>
              <p className="mt-1 text-[14px] text-[#5f6b76]">{address.phone_number}</p>
              <p className="mt-1 text-[14px] text-[#5f6b76]">
                {address.address_line_1}, {address.address_line_2 ? `${address.address_line_2}, ` : ""}
                {address.city}, {address.state}, {address.postal_code}, {address.country}
              </p>

              <button
                onClick={() => handleDelete(address.id)}
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