export default function MobileFrame({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-[#e9f2ea] flex items-center justify-center p-0 sm:p-5">
      <div
        className={`
          w-full min-h-screen bg-[#f4f7f5]
          sm:min-h-[100svh] sm:max-w-[400px]
          sm:rounded-[30px] sm:shadow-2xl sm:overflow-hidden
          lg:max-w-[430px]
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}