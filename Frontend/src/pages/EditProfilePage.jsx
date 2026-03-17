import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { fetchProfile, updateProfile } from "../api/profile";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setForm({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await updateProfile(form);

      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          ...res.user,
        })
      );

      navigate("/profile");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
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
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Edit Profile</h1>
        </div>

        {loading ? (
          <p className="mt-6 text-[#5f6b76]">Loading profile...</p>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-4"
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full rounded-2xl border border-[#d7e1ea] px-4 py-4"
            />

            <button
              disabled={saving}
              className="w-full rounded-full bg-[#0F2A44] py-4 text-[16px] font-semibold text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </MobileFrame>
  );
}