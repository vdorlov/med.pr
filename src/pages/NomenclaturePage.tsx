import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NomenclatureTable from '../components/NomenclatureTable/NomenclatureTable';
import { Search, X, ArrowLeft } from 'lucide-react';
import debounce from 'lodash/debounce';

interface NomenclatureItem {
    id: string;
    section: string;
    serviceType: string;
    serviceClass: string;
    codeMinzdrav: string;
    nameMinzdrav: string;
}

const NomenclaturePage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<NomenclatureItem[]>([]);
    const [filteredData, setFilteredData] = useState<NomenclatureItem[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных
    const fetchData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('nomenclature_medical_services')
                .select('id, chapter, type, class, kod_nomen, name_nomen')
                .order('chapter', { ascending: true });

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            const mappedData = data.map(item => ({
                id: item.id.toString(),
                section: item.chapter,
                serviceType: item.type,
                serviceClass: item.class,
                codeMinzdrav: item.kod_nomen,
                nameMinzdrav: item.name_nomen
            }));

            setData(mappedData);
            setFilteredData(mappedData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Оптимизированная фильтрация с debounce
    const debouncedFilter = useCallback(
        debounce((searchTerm: string) => {
            if (!searchTerm) {
                setFilteredData(data);
                return;
            }

            const searchTermLower = searchTerm.toLowerCase();
            const filtered = data.filter(item => {
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTermLower)
                );
            });
            setFilteredData(filtered);
        }, 300),
        [data]
    );

    const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilter(value);
        debouncedFilter(value);
    };

    const handleClearFilters = () => {
        setGlobalFilter('');
        setFilteredData(data);
    };

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
                    Номенклатура медицинских услуг
                </h1>
                <p className="text-gray-600">
                    Приказ Минздрава России от 13.10.2017 N 804н
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
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
                                onChange={handleGlobalFilterChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                            Найдено: {filteredData.length} из {data.length}
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

            <NomenclatureTable
                data={data}
                filteredData={filteredData}
                onClearAllFilters={handleClearFilters}
            />
        </div>
    );
};

export default NomenclaturePage; 