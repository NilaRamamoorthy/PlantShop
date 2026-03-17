import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import api from "../api/axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/home";

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      if (data) {
        const firstKey = Object.keys(data)[0];
        setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : "Signup failed");
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] px-6 sm:px-7 py-10 bg-[#efefef] flex flex-col justify-center">
        <h1 className="text-[32px] sm:text-[36px] font-extrabold text-black">
          Create Account
        </h1>
        <p className="mt-2 text-gray-600 text-[15px] sm:text-base">
          Start your plant shopping journey
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base sm:text-lg outline-none bg-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base sm:text-lg outline-none bg-white"
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base sm:text-lg outline-none bg-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base sm:text-lg outline-none bg-white"
          />

          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#45AE48] text-white text-lg sm:text-xl font-semibold py-4 rounded-full shadow-md"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00A6ED] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </MobileFrame>
  );
}