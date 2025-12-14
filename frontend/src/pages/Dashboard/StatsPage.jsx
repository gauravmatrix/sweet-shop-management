const StatsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Statistics</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="sweet-card p-6">Total Sweets: --</div>
      <div className="sweet-card p-6">Total Value: --</div>
      <div className="sweet-card p-6">Out of Stock: --</div>
    </div>
  </div>
);

export default StatsPage;