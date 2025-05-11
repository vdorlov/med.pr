import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ERUModal from '../ERUModal/ERUModal';

interface ERUItem {
    id: string;
    section: string;
    subsection1: string;
    subsection2: string;
    codeEru: string;
    nameEru: string;
    codeMinzdrav: string;
    nameMinzdrav: string;
    active: boolean;
    [key: string]: any; // для остальных полей из базы данных
}

interface ERUTableProps {
    data: ERUItem[];
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
        section: string;
        subsection1: string;
        subsection2: string;
        codeEru: string;
        nameEru: string;
        codeMinzdrav: string;
        nameMinzdrav: string;
    };
}

const ERUTable: React.FC<ERUTableProps> = React.memo(({
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
    const [selectedItem, setSelectedItem] = React.useState<ERUItem | null>(null);

    const handleRowClick = (item: ERUItem) => {
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
                            onClick={onClearFilters}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Очистить фильтры
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-full">
                        <div className="bg-gray-50 border-b border-gray-300">
                            <div className="flex">
                                <div className="px-3 py-2 w-[12%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('section')}
                                        >
                                            <span className="text-[11px] font-medium">Раздел</span>
                                            <ArrowUpDown size={14} className={sortField === 'section' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.section}
                                            onChange={(e) => onFilterChange('section', e.target.value)}
                                            placeholder="Фильтр по разделу"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[12%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('subsection1')}
                                        >
                                            <span className="text-[11px] font-medium">Подраздел 1</span>
                                            <ArrowUpDown size={14} className={sortField === 'subsection1' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.subsection1}
                                            onChange={(e) => onFilterChange('subsection1', e.target.value)}
                                            placeholder="Фильтр по подразделу"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[12%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('subsection2')}
                                        >
                                            <span className="text-[11px] font-medium">Подраздел 2</span>
                                            <ArrowUpDown size={14} className={sortField === 'subsection2' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.subsection2}
                                            onChange={(e) => onFilterChange('subsection2', e.target.value)}
                                            placeholder="Фильтр по подразделу"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[12%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('codeEru')}
                                        >
                                            <span className="text-[11px] font-medium">Код ЕРУ</span>
                                            <ArrowUpDown size={14} className={sortField === 'codeEru' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.codeEru}
                                            onChange={(e) => onFilterChange('codeEru', e.target.value)}
                                            placeholder="Фильтр по коду"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[20%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('nameEru')}
                                        >
                                            <span className="text-[11px] font-medium">Наименование ЕРУ</span>
                                            <ArrowUpDown size={14} className={sortField === 'nameEru' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.nameEru}
                                            onChange={(e) => onFilterChange('nameEru', e.target.value)}
                                            placeholder="Фильтр по наименованию"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[12%] border-r border-gray-300">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('codeMinzdrav')}
                                        >
                                            <span className="text-[11px] font-medium">Код Минздрава</span>
                                            <ArrowUpDown size={14} className={sortField === 'codeMinzdrav' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.codeMinzdrav}
                                            onChange={(e) => onFilterChange('codeMinzdrav', e.target.value)}
                                            placeholder="Фильтр по коду"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="px-3 py-2 w-[20%]">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center justify-between hover:text-blue-600 transition-colors w-full"
                                            onClick={() => handleSort('nameMinzdrav')}
                                        >
                                            <span className="text-[11px] font-medium">Наименование Минздрава</span>
                                            <ArrowUpDown size={14} className={sortField === 'nameMinzdrav' ? 'text-blue-600' : ''} />
                                        </button>
                                        <input
                                            type="text"
                                            value={filters.nameMinzdrav}
                                            onChange={(e) => onFilterChange('nameMinzdrav', e.target.value)}
                                            placeholder="Фильтр по наименованию"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[12%] border-r border-gray-300 break-words">
                                            {item.section}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[12%] border-r border-gray-300 break-words">
                                            {item.subsection1}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[12%] border-r border-gray-300 break-words">
                                            {item.subsection2}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[12%] border-r border-gray-300 font-mono break-words">
                                            {item.codeEru}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[20%] border-r border-gray-300 break-words">
                                            {item.nameEru}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[12%] border-r border-gray-300 font-mono break-words">
                                            {item.codeMinzdrav}
                                        </div>
                                        <div className="px-3 py-2 text-xs text-gray-900 w-[20%] break-words">
                                            {item.nameMinzdrav}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    Нет данных
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Показано {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} из {totalCount}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-gray-700">
                                Страница {currentPage} из {totalPages}
                            </span>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ERUModal
                isOpen={!!selectedItem}
                onClose={handleCloseModal}
                eruData={selectedItem}
            />
        </>
    );
});

export default ERUTable; 