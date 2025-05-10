import React, { useState, useMemo, useCallback } from 'react';
import { ArrowUpDown } from 'lucide-react';
import ColumnFilter from '../ServiceTable/ColumnFilter';
import debounce from 'lodash/debounce';

interface NomenclatureItem {
    id: string;
    section: string;
    serviceType: string;
    serviceClass: string;
    codeMinzdrav: string;
    nameMinzdrav: string;
}

interface NomenclatureTableProps {
    data: NomenclatureItem[];
    filteredData: NomenclatureItem[];
    onClearAllFilters?: () => void;
}

type SortField = 'section' | 'serviceType' | 'serviceClass' | 'codeMinzdrav' | 'nameMinzdrav';
type SortDirection = 'asc' | 'desc';

const NomenclatureTable: React.FC<NomenclatureTableProps> = React.memo(({ data, filteredData, onClearAllFilters }) => {
    const [filters, setFilters] = useState({
        serviceType: '',
        serviceClass: '',
        codeMinzdrav: '',
        nameMinzdrav: ''
    });

    const [sectionFilter, setSectionFilter] = useState<string[]>([]);
    const [sortField, setSortField] = useState<SortField>('section');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const handleFilterChange = useCallback((column: string, value: string) => {
        setFilters(prev => ({ ...prev, [column]: value }));
    }, []);

    const debouncedFilterChange = useMemo(
        () => debounce(handleFilterChange, 300),
        [handleFilterChange]
    );

    const handleSectionFilterChange = useCallback((value: string) => {
        setSectionFilter(prev => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            }
            return [...prev, value];
        });
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({
            serviceType: '',
            serviceClass: '',
            codeMinzdrav: '',
            nameMinzdrav: ''
        });
        setSectionFilter([]);
        if (onClearAllFilters) {
            onClearAllFilters();
        }
    }, [onClearAllFilters]);

    const handleSort = useCallback((field: SortField) => {
        setSortField(prev => {
            if (prev === field) {
                setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
                return field;
            }
            setSortDirection('asc');
            return field;
        });
    }, []);

    const filteredAndSortedData = useMemo(() => {
        let result = [...filteredData];

        // Применяем фильтр по разделу
        if (sectionFilter.length > 0) {
            result = result.filter(item => sectionFilter.includes(item.section));
        }

        // Применяем остальные фильтры
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                const searchTerm = value.toLowerCase();
                result = result.filter(item => {
                    const fieldValue = String(item[key as keyof NomenclatureItem]).toLowerCase();
                    return fieldValue.includes(searchTerm);
                });
            }
        });

        // Применяем сортировку
        return result.sort((a, b) => {
            const compareA = a[sortField];
            const compareB = b[sortField];

            if (typeof compareA === 'string' && typeof compareB === 'string') {
                return (sortDirection === 'asc' ? 1 : -1) * compareA.localeCompare(compareB, 'ru');
            }

            const numA = Number(compareA);
            const numB = Number(compareB);
            return (sortDirection === 'asc' ? 1 : -1) * (numA - numB);
        });
    }, [filteredData, filters, sectionFilter, sortField, sortDirection]);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <div className="bg-gray-50 border-b border-gray-300">
                        <div className="flex">
                            <div className="px-3 py-2 w-[10%] border-r border-gray-300">
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('section')}
                                    >
                                        <span className="text-[10px] font-medium">Раздел</span>
                                        <ArrowUpDown size={14} className={sortField === 'section' ? 'text-blue-600' : ''} />
                                    </button>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <label className="flex items-center gap-1 text-[10px]">
                                            <input
                                                type="checkbox"
                                                checked={sectionFilter.includes('A')}
                                                onChange={() => handleSectionFilterChange('A')}
                                                className="w-3 h-3"
                                            />
                                            A
                                        </label>
                                        <label className="flex items-center gap-1 text-[10px]">
                                            <input
                                                type="checkbox"
                                                checked={sectionFilter.includes('B')}
                                                onChange={() => handleSectionFilterChange('B')}
                                                className="w-3 h-3"
                                            />
                                            B
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('serviceType')}
                                    >
                                        <span className="text-[10px] font-medium">Тип услуги</span>
                                        <ArrowUpDown size={14} className={sortField === 'serviceType' ? 'text-blue-600' : ''} />
                                    </button>
                                    <ColumnFilter
                                        column="serviceType"
                                        value={filters.serviceType}
                                        onChange={debouncedFilterChange}
                                        placeholder="Фильтр..."
                                    />
                                </div>
                            </div>
                            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('serviceClass')}
                                    >
                                        <span className="text-[10px] font-medium">Класс услуги</span>
                                        <ArrowUpDown size={14} className={sortField === 'serviceClass' ? 'text-blue-600' : ''} />
                                    </button>
                                    <ColumnFilter
                                        column="serviceClass"
                                        value={filters.serviceClass}
                                        onChange={debouncedFilterChange}
                                        placeholder="Фильтр..."
                                    />
                                </div>
                            </div>
                            <div className="px-3 py-2 w-[15%] border-r border-gray-300">
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('codeMinzdrav')}
                                    >
                                        <span className="text-[11px] font-medium">Код Минздрава</span>
                                        <ArrowUpDown size={14} className={sortField === 'codeMinzdrav' ? 'text-blue-600' : ''} />
                                    </button>
                                    <ColumnFilter
                                        column="codeMinzdrav"
                                        value={filters.codeMinzdrav}
                                        onChange={debouncedFilterChange}
                                        placeholder="Фильтр..."
                                    />
                                </div>
                            </div>
                            <div className="px-3 py-2 w-[45%]">
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="flex items-center justify-between hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('nameMinzdrav')}
                                    >
                                        <span className="text-[11px] font-medium">Наименование Минздрава</span>
                                        <ArrowUpDown size={14} className={sortField === 'nameMinzdrav' ? 'text-blue-600' : ''} />
                                    </button>
                                    <ColumnFilter
                                        column="nameMinzdrav"
                                        value={filters.nameMinzdrav}
                                        onChange={debouncedFilterChange}
                                        placeholder="Фильтр..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((item) => (
                                <div key={item.id} className="flex hover:bg-gray-50">
                                    <div className="px-3 py-2 text-[10px] text-gray-900 w-[10%] border-r border-gray-300 break-words">
                                        {item.section}
                                    </div>
                                    <div className="px-3 py-2 text-[10px] text-gray-900 w-[15%] border-r border-gray-300 break-words">
                                        {item.serviceType}
                                    </div>
                                    <div className="px-3 py-2 text-[10px] text-gray-900 w-[15%] border-r border-gray-300 break-words">
                                        {item.serviceClass}
                                    </div>
                                    <div className="px-3 py-2 text-[11px] text-gray-900 w-[15%] border-r border-gray-300 font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.codeMinzdrav}
                                    </div>
                                    <div className="px-3 py-2 text-[11px] text-gray-900 w-[45%] break-words">
                                        {item.nameMinzdrav}
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
        </div>
    );
});

NomenclatureTable.displayName = 'NomenclatureTable';

export default NomenclatureTable; 