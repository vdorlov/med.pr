import React, { useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ERLUModal from '../ERLUModal/ERLUModal';
import ColumnFilter from './ColumnFilter';

interface ERLUItem {
    id: string;
    section_lab: string;
    subsection_1_lab: string;
    subsection_2_lab: string;
    subsection_3_lab: string;
    kod_eru_lab: string;
    name_eru_lab: string;
    kod_nomen: string;
    name_nomen: string;
    active: boolean;
    [key: string]: any;
}

interface ERLUTableProps {
    data: ERLUItem[];
    showArchived: boolean;
    onShowArchivedChange: (show: boolean) => void;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onFilterChange: (field: string, value: string) => void;
    onClearFilters: () => void;
    filters: {
        section_lab: string;
        subsection_1_lab: string;
        subsection_2_lab: string;
        subsection_3_lab: string;
        kod_eru_lab: string;
        name_eru_lab: string;
        kod_nomen: string;
        name_nomen: string;
    };
}

const ERLUTable: React.FC<ERLUTableProps> = React.memo(({
    data,
    showArchived,
    onShowArchivedChange,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    onFilterChange,
    onClearFilters,
    filters
}) => {
    const [selectedItem, setSelectedItem] = React.useState<ERLUItem | null>(null);
    const [localFilters, setLocalFilters] = React.useState(filters);

    // Фильтрация в реальном времени
    const filteredData = useMemo(() => {
        return data.filter(item => {
            return Object.entries(localFilters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = String(item[key as keyof ERLUItem]).toLowerCase();
                return itemValue.includes(value.toLowerCase());
            });
        });
    }, [data, localFilters]);

    // Обработчик изменения фильтров - только локальное обновление
    const handleFilterChange = (field: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Очистка фильтров
    const handleClearFilters = () => {
        setLocalFilters({
            section_lab: '',
            subsection_1_lab: '',
            subsection_2_lab: '',
            subsection_3_lab: '',
            kod_eru_lab: '',
            name_eru_lab: '',
            kod_nomen: '',
            name_nomen: ''
        });
        onClearFilters();
    };

    const handleRowClick = (item: ERLUItem) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(field, newDirection);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showArchived"
                                checked={showArchived}
                                onChange={(e) => onShowArchivedChange(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showArchived" className="text-sm text-gray-700">
                                Вывод архивированных услуг
                            </label>
                        </div>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Очистить фильтры
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-3 py-2 w-[200px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('section_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Раздел</span>
                                            <ArrowUpDown size={14} className={sortField === 'section_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="section_lab"
                                            value={localFilters.section_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по разделу"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[200px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('subsection_1_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Подраздел 1</span>
                                            <ArrowUpDown size={14} className={sortField === 'subsection_1_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="subsection_1_lab"
                                            value={localFilters.subsection_1_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по подразделу"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[200px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('subsection_2_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Подраздел 2</span>
                                            <ArrowUpDown size={14} className={sortField === 'subsection_2_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="subsection_2_lab"
                                            value={localFilters.subsection_2_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по подразделу"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[200px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('subsection_3_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Подраздел 3</span>
                                            <ArrowUpDown size={14} className={sortField === 'subsection_3_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="subsection_3_lab"
                                            value={localFilters.subsection_3_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по подразделу"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[150px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('kod_eru_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Код ЕРЛУ</span>
                                            <ArrowUpDown size={14} className={sortField === 'kod_eru_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="kod_eru_lab"
                                            value={localFilters.kod_eru_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по коду"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[300px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('name_eru_lab')}
                                        >
                                            <span className="text-[11px] font-medium">Наименование ЕРЛУ</span>
                                            <ArrowUpDown size={14} className={sortField === 'name_eru_lab' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="name_eru_lab"
                                            value={localFilters.name_eru_lab}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по наименованию"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[150px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('kod_nomen')}
                                        >
                                            <span className="text-[11px] font-medium">Код Минздрава</span>
                                            <ArrowUpDown size={14} className={sortField === 'kod_nomen' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="kod_nomen"
                                            value={localFilters.kod_nomen}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по коду"
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 w-[300px] border border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('name_nomen')}
                                        >
                                            <span className="text-[11px] font-medium">Наименование Минздрава</span>
                                            <ArrowUpDown size={14} className={sortField === 'name_nomen' ? 'text-blue-600' : ''} />
                                        </button>
                                        <ColumnFilter
                                            column="name_nomen"
                                            value={localFilters.name_nomen}
                                            onChange={handleFilterChange}
                                            placeholder="Фильтр по наименованию"
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[200px] border border-gray-300 align-top">
                                            {item.section_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[200px] border border-gray-300 align-top">
                                            {item.subsection_1_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[200px] border border-gray-300 align-top">
                                            {item.subsection_2_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[200px] border border-gray-300 align-top">
                                            {item.subsection_3_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[150px] border border-gray-300 font-mono align-top">
                                            {item.kod_eru_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[300px] border border-gray-300 align-top">
                                            {item.name_eru_lab}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[150px] border border-gray-300 font-mono align-top">
                                            {item.kod_nomen}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-900 w-[300px] border border-gray-300 align-top">
                                            {item.name_nomen}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">
                                        Нет данных
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Показано {filteredData.length} из {totalCount} записей
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm text-gray-700">
                                Страница {currentPage} из {totalPages}
                            </span>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {selectedItem && (
                <ERLUModal
                    item={selectedItem}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
});

export default ERLUTable; 