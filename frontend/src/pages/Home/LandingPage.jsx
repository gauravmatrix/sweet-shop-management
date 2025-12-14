const LandingPage = () => (
  <div className="text-center py-12">
    <h1 className="text-5xl font-bold text-sweet-primary mb-4">Welcome to Sweet Shop! 🍬</h1>
    <p className="text-xl text-sweet-dark/70 mb-8">Manage your sweet inventory with ease</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="sweet-card p-6">Browse Sweets</div>
      <div className="sweet-card p-6">Track Inventory</div>
      <div className="sweet-card p-6">Manage Orders</div>
    </div>
  </div>
);

export default LandingPage;