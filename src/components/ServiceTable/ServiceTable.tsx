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
    // Создаем индекс для быстрого поиска
    const searchIndex = new Map<string, Set<string>>();

    // Функция для добавления значения в индекс
    const addToIndex = (key: string, value: string) => {
      const normalizedValue = value.toLowerCase();
      if (!searchIndex.has(normalizedValue)) {
        searchIndex.set(normalizedValue, new Set());
      }
      searchIndex.get(normalizedValue)?.add(key);
    };

    // Создаем поисковый индекс для всех данных
    filteredData.forEach((item, index) => {
      const key = index.toString();
      Object.values(item).forEach(value => {
        if (value) {
          addToIndex(key, String(value));
        }
      });
    });

    // Применяем глобальный фильтр
    let resultIndexes = new Set<string>();
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      searchIndex.forEach((indexes, value) => {
        if (value.includes(searchTerm)) {
          indexes.forEach(index => resultIndexes.add(index));
        }
      });
    } else {
      // Если нет глобального фильтра, включаем все индексы
      filteredData.forEach((_, index) => resultIndexes.add(index.toString()));
    }

    // Применяем фильтры по колонкам
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const searchTerm = value.toLowerCase();
        const newIndexes = new Set<string>();

        resultIndexes.forEach(index => {
          const item = filteredData[parseInt(index)];
          const fieldValue = String(item[key as keyof ServiceItem]).toLowerCase();
          if (fieldValue.includes(searchTerm)) {
            newIndexes.add(index);
          }
        });

        resultIndexes = newIndexes;
      }
    });

    // Получаем отфильтрованные данные
    let result = Array.from(resultIndexes).map(index => filteredData[parseInt(index)]);

    // Применяем сортировку
    result.sort((a, b) => {
      const compareA = a[sortField];
      const compareB = b[sortField];

      if (typeof compareA === 'string' && typeof compareB === 'string') {
        return (sortDirection === 'asc' ? 1 : -1) * compareA.localeCompare(compareB, 'ru');
      }

      const numA = Number(compareA);
      const numB = Number(compareB);
      return (sortDirection === 'asc' ? 1 : -1) * (numA - numB);
    });

    return result;
  }, [filteredData, filters, globalFilter, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-lg shadow">
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

      <div className="relative">
        <div className="sticky top-0 z-10 bg-gray-100">
          <div className="flex border-b-2 border-gray-300">
            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('section')}
                >
                  <span className="text-[11px] font-medium">Раздел</span>
                  <ArrowUpDown size={14} className={sortField === 'section' ? 'text-blue-600' : ''} />
                </button>
                <ColumnFilter
                  column="section"
                  value={filters.section}
                  onChange={handleFilterChange}
                  placeholder="Фильтр..."
                />
              </div>
            </div>
            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('subsection1')}
                >
                  <span className="text-[11px] font-medium">Подраздел 1</span>
                  <ArrowUpDown size={14} className={sortField === 'subsection1' ? 'text-blue-600' : ''} />
                </button>
                <ColumnFilter
                  column="subsection1"
                  value={filters.subsection1}
                  onChange={handleFilterChange}
                  placeholder="Фильтр..."
                />
              </div>
            </div>
            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('subsection2')}
                >
                  <span className="text-[11px] font-medium">Подраздел 2</span>
                  <ArrowUpDown size={14} className={sortField === 'subsection2' ? 'text-blue-600' : ''} />
                </button>
                <ColumnFilter
                  column="subsection2"
                  value={filters.subsection2}
                  onChange={handleFilterChange}
                  placeholder="Фильтр..."
                />
              </div>
            </div>
            <div className="px-3 py-2 w-[14%] border-r border-gray-300">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('codeEru')}
                >
                  <span className="text-[11px] font-medium">Код ЕРУ</span>
                  <ArrowUpDown size={14} className={sortField === 'codeEru' ? 'text-blue-600' : ''} />
                </button>
                <ColumnFilter
                  column="codeEru"
                  value={filters.codeEru}
                  onChange={handleFilterChange}
                  placeholder="Фильтр..."
                />
              </div>
            </div>
            <div className="px-3 py-2 w-[31%] border-r border-gray-300">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('nameEru')}
                >
                  <span className="text-[11px] font-medium">Наименование ЕРУ</span>
                  <ArrowUpDown size={14} className={sortField === 'nameEru' ? 'text-blue-600' : ''} />
                </button>
                <ColumnFilter
                  column="nameEru"
                  value={filters.nameEru}
                  onChange={handleFilterChange}
                  placeholder="Фильтр..."
                />
              </div>
            </div>
            <div className="px-3 py-2 w-[10%]">
              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center justify-between hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('cost')}
                >
                  <span className="text-[11px] font-medium">Стоимость</span>
                  <ArrowUpDown size={14} className={sortField === 'cost' ? 'text-blue-600' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAndSortedData.length > 0 ? (
            filteredAndSortedData.map((item) => (
              <div key={item.id} className="flex hover:bg-gray-50">
                <div className="px-3 py-2 text-xs text-gray-900 w-[15%] border-r border-gray-300 break-words">
                  {item.section}
                </div>
                <div className="px-3 py-2 text-xs text-gray-900 w-[15%] border-r border-gray-300 break-words">
                  {item.subsection1}
                </div>
                <div className="px-3 py-2 text-xs text-gray-900 w-[15%] border-r border-gray-300 break-words">
                  {item.subsection2}
                </div>
                <div className="px-3 py-2 text-xs text-gray-900 w-[14%] border-r border-gray-300 font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.codeEru}
                </div>
                <div className="px-3 py-2 text-xs text-gray-900 w-[31%] border-r border-gray-300 break-words">
                  {item.nameEru}
                </div>
                <div className="px-3 py-2 text-xs text-gray-900 w-[10%] text-right whitespace-nowrap">
                  {item.cost.toLocaleString('ru')} ₽
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Нет данных, соответствующих выбранным фильтрам
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceTable;