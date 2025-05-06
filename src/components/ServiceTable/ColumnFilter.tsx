import React from 'react';
import { Search, X } from 'lucide-react';

interface ColumnFilterProps {
  column: string;
  value: string;
  onChange: (column: string, value: string) => void;
  placeholder?: string;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  column,
  value,
  onChange,
  placeholder = 'Поиск...'
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-400">
        <Search size={16} />
      </div>
      <input
        type="text"
        className="w-full py-1 pl-8 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(column, e.target.value)}
      />
      {value && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          onClick={() => onChange(column, '')}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default ColumnFilter;