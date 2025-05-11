import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import ERLUTable from '../components/ERLUTable/ERLUTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const ERLUPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sortField, setSortField] = useState('kod_eru_lab');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({
        section_lab: '',
        subsection_1_lab: '',
        subsection_2_lab: '',
        subsection_3_lab: '',
        kod_eru_lab: '',
        name_eru_lab: '',
        kod_nomen: '',
        name_nomen: ''
    });

    const pageSize = 50;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('erlu')
                .select('*', { count: 'exact' });

            // Применяем фильтры
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    query = query.ilike(key, `%${value}%`);
                }
            });

            // Применяем сортировку
            query = query.order(sortField, { ascending: sortDirection === 'asc' });

            // Применяем пагинацию
            const from = (currentPage - 1) * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);

            const { data: fetchedData, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            setData(fetchedData || []);
            setTotalCount(count || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    };

    // Создаем debounced версию fetchData
    const debouncedFetchData = useCallback(
        debounce(() => {
            fetchData();
        }, 300),
        [filters, currentPage, sortField, sortDirection, showArchived]
    );

    useEffect(() => {
        debouncedFetchData();
        // Очищаем debounce при размонтировании компонента
        return () => {
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData]);

    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            section_lab: '',
            subsection_1_lab: '',
            subsection_2_lab: '',
            subsection_3_lab: '',
            kod_eru_lab: '',
            name_eru_lab: '',
            kod_nomen: '',
            name_nomen: ''
        });
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h2 className="text-red-800 font-medium">Ошибка</h2>
                        <p className="text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Вернуться на главную
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Единый реестр лабораторных услуг (ЕРЛУ)
                    </h1>
                    <p className="text-gray-600">
                        Справочник содержит информацию о лабораторных услугах, их кодах и наименованиях
                    </p>
                </div>

                <ERLUTable
                    data={data}
                    showArchived={showArchived}
                    onShowArchivedChange={setShowArchived}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    filters={filters}
                />
            </div>
        </div>
    );
};

export default ERLUPage; 