import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ERUTable from '../components/ERUTable/ERUTable';
import { ArrowLeft } from 'lucide-react';

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
}

const PAGE_SIZE = 50;

const ERUPage: React.FC = () => {
    const navigate = useNavigate();
    const [allData, setAllData] = useState<ERUItem[]>([]);
    const [filteredData, setFilteredData] = useState<ERUItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [sortField, setSortField] = useState('section');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({
        section: '',
        subsection1: '',
        subsection2: '',
        codeEru: '',
        nameEru: '',
        codeMinzdrav: '',
        nameMinzdrav: ''
    });

    // Загрузка всех данных
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            let query = supabase
                .from('eru')
                .select('*')
                .neq('section', 'Технические услуги') // Исключаем технические услуги
                .order(sortField, { ascending: sortDirection === 'asc' });

            // Если не показываем архив, фильтруем только активные
            if (!showArchived) {
                query = query.eq('active', true);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            const mappedData = data.map(item => ({
                id: item.id.toString(),
                section: item.section,
                subsection1: item.subsection_1 || '',
                subsection2: item.subsection_2 || '',
                codeEru: item.kod_eru,
                nameEru: item.name_eru,
                codeMinzdrav: item.kod_nomen || '',
                nameMinzdrav: item.name_nomen || '',
                active: item.active,
                ...item // добавляем все остальные поля из базы данных
            }));

            setAllData(mappedData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [showArchived, sortField, sortDirection]);

    // Применение фильтров и пагинации
    useEffect(() => {
        let filtered = [...allData];

        // Применяем фильтры
        if (filters.section) {
            filtered = filtered.filter(item =>
                item.section.toLowerCase().includes(filters.section.toLowerCase())
            );
        }
        if (filters.subsection1) {
            filtered = filtered.filter(item =>
                item.subsection1.toLowerCase().includes(filters.subsection1.toLowerCase())
            );
        }
        if (filters.subsection2) {
            filtered = filtered.filter(item =>
                item.subsection2.toLowerCase().includes(filters.subsection2.toLowerCase())
            );
        }
        if (filters.codeEru) {
            filtered = filtered.filter(item =>
                item.codeEru.toLowerCase().includes(filters.codeEru.toLowerCase())
            );
        }
        if (filters.nameEru) {
            filtered = filtered.filter(item =>
                item.nameEru.toLowerCase().includes(filters.nameEru.toLowerCase())
            );
        }
        if (filters.codeMinzdrav) {
            filtered = filtered.filter(item =>
                item.codeMinzdrav.toLowerCase().includes(filters.codeMinzdrav.toLowerCase())
            );
        }
        if (filters.nameMinzdrav) {
            filtered = filtered.filter(item =>
                item.nameMinzdrav.toLowerCase().includes(filters.nameMinzdrav.toLowerCase())
            );
        }

        // Обновляем общее количество
        setTotalCount(filtered.length);

        // Применяем пагинацию
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        filtered = filtered.slice(start, end);

        setFilteredData(filtered);
    }, [allData, filters, currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Обработчик изменения отображения архивных услуг
    const handleShowArchivedChange = useCallback((show: boolean) => {
        setShowArchived(show);
        setCurrentPage(1);
    }, []);

    // Обработчик изменения страницы
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Обработчик сортировки
    const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
    }, []);

    // Обработчик изменения фильтров
    const handleFilterChange = useCallback((field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({
            section: '',
            subsection1: '',
            subsection2: '',
            codeEru: '',
            nameEru: '',
            codeMinzdrav: '',
            nameMinzdrav: ''
        });
        setCurrentPage(1);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Вернуться на главную</span>
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Единый реестр услуг (ЕРУ)
                </h1>
                <p className="text-gray-600">
                    Справочник медицинских услуг
                </p>
            </div>

            <ERUTable
                data={filteredData}
                showArchived={showArchived}
                onShowArchivedChange={handleShowArchivedChange}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filters={filters}
            />
        </div>
    );
};

export default ERUPage; 