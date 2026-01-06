import nebengWatermark from "@/assets/nebeng-watermark.png";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-full relative overflow-hidden">
      {/* Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={nebengWatermark} 
          alt="" 
          className="w-[600px] opacity-[0.15] select-none grayscale mix-blend-multiply"
          style={{
            filter: "brightness(1.2) contrast(0.8) grayscale(0.3)",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
