import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import plantImage from "../assets/landing-plant.png";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="min-h-[100svh] flex flex-col items-center px-8 pt-10 pb-8 text-center ">
        <p className="text-[20px] sm:text-[22px] font-medium text-black mt-2">
          Planto shop
        </p>

        <h1 className="mt-1 text-[32px] sm:text-[36px] leading-[1.08] font-extrabold text-[#1faa59]">
          Plant a
          <br />
          tree for like
        </h1>

        <div className="mt-8 flex-1 flex items-center justify-center">
          <img
  src={plantImage}
  alt="plant"
  className="w-[240px] sm:w-[270px] object-contain"
/>
        </div>

        <h2 className="text-[22px] sm:text-[26px] font-semibold text-black mb-10">
          Home Plant
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-[#45AE48] text-white text-[22px] sm:text-[22px] font-semibold py-2 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.12)]"
        >
          Get Start
        </button>
      </div>
    </MobileFrame>
  );
}