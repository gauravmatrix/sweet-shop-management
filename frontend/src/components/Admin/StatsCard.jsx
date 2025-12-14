const StatsCard = ({ title, value, icon, color }) => (
  <div className={`sweet-card p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-sweet-dark/70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

export default StatsCard;