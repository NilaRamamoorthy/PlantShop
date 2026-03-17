export default function CheckoutSteps({ current = "location", showBack = false, onBack }) {
  const steps = [
    { key: "location", label: "Location", icon: "⌖" },
    { key: "payment", label: "Payment", icon: "▭" },
    { key: "summary", label: "Summary", icon: "🛍" },
  ];

  const getStepIndex = (key) => steps.findIndex((step) => step.key === key);
  const currentIndex = getStepIndex(current);

  return (
    <div className="pt-8">
      {showBack ? (
        <button
          onClick={onBack}
          className="mb-4 text-[#45AE48] text-[28px] leading-none"
        >
          ←
        </button>
      ) : null}

      <h1 className="text-center text-[20px] font-bold text-black">Checkout</h1>

      <div className="mt-8 px-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-[12%] right-[12%] top-4 h-[2px] border-t-2 border-dashed border-[#8c8c8c]" />

          {steps.map((step, index) => {
            const isActive = index <= currentIndex;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[20px] ${
                    isActive ? "text-[#45AE48]" : "text-black"
                  } bg-[#efefef]`}
                >
                  {step.icon}
                </div>
                <p className="mt-3 text-[14px] font-semibold text-black">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}