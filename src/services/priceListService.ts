import { supabase } from '../lib/supabase';
import { ServiceItem } from '../types';

// Тип для колбэка обновления кэша
type CacheUpdateCallback = (type: 'start' | 'end') => void;

// Кэш для хранения данных
const cache = {
    ambulatory: new Map<string, ServiceItem[]>(),
    laboratory: new Map<string, ServiceItem[]>(),
    timestamp: new Map<string, number>(),
    updateCallbacks: new Set<CacheUpdateCallback>()
};

// Время жизни кэша - 5 минут
const CACHE_TTL = 5 * 60 * 1000;

// Размер страницы для пагинации
const PAGE_SIZE = 1000;

// Вспомогательная функция для уведомления об обновлении кэша
const notifyCacheUpdate = (type: 'start' | 'end') => {
    cache.updateCallbacks.forEach(callback => callback(type));
};

// Вспомогательная функция для загрузки данных с пагинацией
const loadDataInChunks = async (
    table: string,
    orderField: string,
    mapFunction: (item: any) => ServiceItem
): Promise<ServiceItem[]> => {
    let allData: ServiceItem[] = [];
    let hasMore = true;
    let startIndex = 0;

    while (hasMore) {
        const { data, error } = await supabase
            .from(table)
            .select()
            .range(startIndex, startIndex + PAGE_SIZE - 1)
            .order(orderField, { ascending: true });

        if (error) {
            console.error(`Error fetching ${table}:`, error);
            throw error;
        }

        if (!data || data.length === 0) {
            hasMore = false;
        } else {
            allData = [...allData, ...data.map(mapFunction)];
            startIndex += PAGE_SIZE;
            hasMore = data.length === PAGE_SIZE;
        }
    }

    return allData;
};

export const priceListService = {
    // Метод для подписки на обновления кэша
    subscribeToCacheUpdates(callback: CacheUpdateCallback) {
        cache.updateCallbacks.add(callback);
        return () => cache.updateCallbacks.delete(callback);
    },

    async getAmbulatoryStationaryServices(clinicId: string): Promise<ServiceItem[]> {
        // Если это не HMM, возвращаем пустой массив
        if (clinicId !== 'hmm') {
            return [];
        }

        // Проверяем кэш
        const cacheKey = `ambulatory-${clinicId}`;
        const cachedData = cache.ambulatory.get(cacheKey);
        const cachedTime = cache.timestamp.get(cacheKey);

        if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TTL) {
            return cachedData;
        }

        // Уведомляем о начале обновления кэша
        notifyCacheUpdate('start');

        try {
            const mappedData = await loadDataInChunks(
                'ambulatory_stationary_services',
                'section',
                item => ({
                    id: item.id.toString(),
                    section: item.section,
                    subsection1: item.subsection_1 || '',
                    subsection2: item.subsection_2 || '',
                    codeEru: item.kod_eru,
                    nameEru: item.name_eru,
                    cost: item.price,
                    type: 'outpatient-inpatient' as const
                })
            );

            // Сохраняем в кэш
            cache.ambulatory.set(cacheKey, mappedData);
            cache.timestamp.set(cacheKey, Date.now());

            return mappedData;
        } finally {
            // Уведомляем о завершении обновления кэша
            notifyCacheUpdate('end');
        }
    },

    async getLaboratoryServices(clinicId: string): Promise<ServiceItem[]> {
        // Если это не HMM, возвращаем пустой массив
        if (clinicId !== 'hmm') {
            return [];
        }

        // Проверяем кэш
        const cacheKey = `laboratory-${clinicId}`;
        const cachedData = cache.laboratory.get(cacheKey);
        const cachedTime = cache.timestamp.get(cacheKey);

        if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TTL) {
            return cachedData;
        }

        // Уведомляем о начале обновления кэша
        notifyCacheUpdate('start');

        try {
            const mappedData = await loadDataInChunks(
                'laboratory_services',
                'section_lab',
                item => ({
                    id: item.id.toString(),
                    section: item.section_lab,
                    subsection1: item.subsection_1_lab || '',
                    subsection2: item.subsection_2_lab || '',
                    codeEru: item.kod_eru_lab,
                    nameEru: item.name_eru_lab,
                    cost: item.price_lab,
                    type: 'laboratory' as const
                })
            );

            // Сохраняем в кэш
            cache.laboratory.set(cacheKey, mappedData);
            cache.timestamp.set(cacheKey, Date.now());

            return mappedData;
        } finally {
            // Уведомляем о завершении обновления кэша
            notifyCacheUpdate('end');
        }
    },

    // Метод для очистки кэша
    clearCache() {
        cache.ambulatory.clear();
        cache.laboratory.clear();
        cache.timestamp.clear();
    }
}; 