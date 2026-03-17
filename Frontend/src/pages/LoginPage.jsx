import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/home";

  const [form, setForm] = useState({
    email: "",
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
      const res = await api.post("/auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.non_field_errors?.[0] || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] px-6 sm:px-7 py-10 bg-[#efefef] flex flex-col justify-center">
        <h1 className="text-[32px] sm:text-[36px] font-extrabold text-black">
          Welcome Back
        </h1>
        <p className="mt-2 text-gray-600 text-[15px] sm:text-base">
          Login to continue shopping plants
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#00A6ED] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </MobileFrame>
  );
}