import React, { useState, useMemo } from 'react';
import { ServiceItem } from '../../types';
import ColumnFilter from './ColumnFilter';
import { ArrowUpDown, Search, X } from 'lucide-react';

interface ServiceTableProps {
  data: ServiceItem[];
  filteredData: ServiceItem[];
  onClearAllFilters?: () => void;
}

type SortField = 'section' | 'subsection1' | 'subsection2' | 'codeEru' | 'nameEru' | 'cost';
type SortDirection = 'asc' | 'desc';

const ServiceTable: React.FC<ServiceTableProps> = ({ data, filteredData, onClearAllFilters }) => {
  const [filters, setFilters] = useState({
    section: '',
    subsection1: '',
    subsection2: '',
    codeEru: '',
    nameEru: ''
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('section');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      section: '',
      subsection1: '',
      subsection2: '',
      codeEru: '',
      nameEru: ''
    });
    setGlobalFilter('');
    if (onClearAllFilters) {
      onClearAllFilters();
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...filteredData];

    // Apply global filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const searchTerm = value.toLowerCase();
        result = result.filter(item =>
          String(item[key as keyof ServiceItem]).toLowerCase().includes(searchTerm)
        );
      }
    });

    // Apply sorting
    return result.sort((a, b) => {
      let compareA: string | number = a[sortField];
      let compareB: string | number = b[sortField];

      if (typeof compareA === 'string' && typeof compareB === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, filters, globalFilter, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Поиск по всей таблице..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Найдено: {filteredAndSortedData.length} из {data.length}
            </span>
            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-fixed divide-y divide-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[12%] border-b-2 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('section')}
                  >
                    <span className="text-xs">Раздел</span>
                    <ArrowUpDown size={16} className={sortField === 'section' ? 'text-blue-600' : ''} />
                  </button>
                  <ColumnFilter
                    column="section"
                    value={filters.section}
                    onChange={handleFilterChange}
                    placeholder="Фильтр..."
                  />
                </div>
              </th>
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[12%] border-b-2 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('subsection1')}
                  >
                    <span className="text-xs">Подраздел 1</span>
                    <ArrowUpDown size={16} className={sortField === 'subsection1' ? 'text-blue-600' : ''} />
                  </button>
                  <ColumnFilter
                    column="subsection1"
                    value={filters.subsection1}
                    onChange={handleFilterChange}
                    placeholder="Фильтр..."
                  />
                </div>
              </th>
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[12%] border-b-2 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('subsection2')}
                  >
                    <span className="text-xs">Подраздел 2</span>
                    <ArrowUpDown size={16} className={sortField === 'subsection2' ? 'text-blue-600' : ''} />
                  </button>
                  <ColumnFilter
                    column="subsection2"
                    value={filters.subsection2}
                    onChange={handleFilterChange}
                    placeholder="Фильтр..."
                  />
                </div>
              </th>
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[14%] border-b-2 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('codeEru')}
                  >
                    <span>Код ЕРУ</span>
                    <ArrowUpDown size={16} className={sortField === 'codeEru' ? 'text-blue-600' : ''} />
                  </button>
                  <ColumnFilter
                    column="codeEru"
                    value={filters.codeEru}
                    onChange={handleFilterChange}
                    placeholder="Фильтр..."
                  />
                </div>
              </th>
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[40%] border-b-2 border-r border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('nameEru')}
                  >
                    <span>Наименование ЕРУ</span>
                    <ArrowUpDown size={16} className={sortField === 'nameEru' ? 'text-blue-600' : ''} />
                  </button>
                  <ColumnFilter
                    column="nameEru"
                    value={filters.nameEru}
                    onChange={handleFilterChange}
                    placeholder="Фильтр..."
                  />
                </div>
              </th>
              <th className="sticky top-0 px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-[10%] border-b-2 border-gray-300">
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center justify-between hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('cost')}
                  >
                    <span>Стоимость</span>
                    <ArrowUpDown size={16} className={sortField === 'cost' ? 'text-blue-600' : ''} />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[10px] text-gray-900 border-b border-r border-gray-200 whitespace-normal leading-tight">{item.section}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-900 border-b border-r border-gray-200 whitespace-normal leading-tight">{item.subsection1}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-900 border-b border-r border-gray-200 whitespace-normal leading-tight">{item.subsection2}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-200 font-mono">{item.codeEru}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-200">{item.nameEru}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200 text-right">
                    {item.cost.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Нет данных, соответствующих фильтрам
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;