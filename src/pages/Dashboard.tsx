import nebengWatermark from "@/assets/nebeng-watermark.png";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <img 
          src={nebengWatermark} 
          alt="Nebeng" 
          className="w-[500px] opacity-80 select-none"
        />
      </div>
    </div>
  );
};

export default Dashboard;
