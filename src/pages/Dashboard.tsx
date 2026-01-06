const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        {/* Nebeng Logo Watermark */}
        <div className="relative">
          <h1 className="text-[120px] font-bold text-muted-foreground/10 select-none">
            Nebeng
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 opacity-20">
              <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simplified scooter/motorcycle illustration */}
                <circle cx="25" cy="45" r="12" stroke="currentColor" strokeWidth="3" className="text-primary" />
                <circle cx="75" cy="45" r="12" stroke="currentColor" strokeWidth="3" className="text-primary" />
                <path d="M25 45 L40 30 L60 30 L75 45" stroke="currentColor" strokeWidth="3" className="text-primary" />
                <path d="M45 30 L50 15 L55 15" stroke="currentColor" strokeWidth="3" className="text-primary" />
                <circle cx="50" cy="10" r="5" fill="currentColor" className="text-primary" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
