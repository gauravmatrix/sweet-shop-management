const SweetDetails = ({ sweet }) => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold text-sweet-dark">{sweet.name}</h3>
    <p className="text-sweet-dark/70">{sweet.description}</p>
    <div className="flex items-center space-x-4">
      <span className="px-3 py-1 bg-sweet-primary/10 text-sweet-primary rounded-full">
        {sweet.category}
      </span>
      <span className="text-xl font-bold text-sweet-dark">₹{sweet.price}</span>
      <span className={`px-3 py-1 rounded-full ${
        sweet.quantity > 10 ? 'bg-green-500/10 text-green-700' :
        sweet.quantity > 0 ? 'bg-yellow-500/10 text-yellow-700' :
        'bg-red-500/10 text-red-700'
      }`}>
        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
      </span>
    </div>
  </div>
);

export default SweetDetails;