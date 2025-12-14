export const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`w-full border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gradient-to-r from-sweet-primary to-sweet-accent text-white">
    <tr>{children}</tr>
  </thead>
);

export const TableRow = ({ children, onClick }) => (
  <tr onClick={onClick} className="border-b border-sweet-light hover:bg-sweet-light/50 transition-colors">
    {children}
  </tr>
);

export const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left font-semibold">{children}</th>
);

export const TableCell = ({ children }) => (
  <td className="px-4 py-3">{children}</td>
);