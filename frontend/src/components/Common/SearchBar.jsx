import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search sweets..." }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/50" size={20} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-sweet-light rounded-lg focus:border-sweet-primary focus:ring-2 focus:ring-sweet-primary/20 outline-none"
    />
  </div>
);

export default SearchBar;