import { supabase } from '../lib/supabase';
import { ServiceItem } from '../types';

export const priceListService = {
    async getAmbulatoryStationaryServices(): Promise<ServiceItem[]> {
        const { data, error } = await supabase
            .from('ambulatory_stationary_services')
            .select()
            .limit(1000000)
            .returns<any[]>();

        if (error) {
            console.error('Error fetching ambulatory services:', error);
            throw error;
        }

        if (!data) return [];

        return data.map(item => ({
            id: item.id.toString(),
            section: item.section,
            subsection1: item.subsection_1 || '',
            subsection2: item.subsection_2 || '',
            codeEru: item.kod_eru,
            nameEru: item.name_eru,
            cost: item.price,
            type: 'outpatient-inpatient' as const
        }));
    },

    async getLaboratoryServices(): Promise<ServiceItem[]> {
        const { data, error } = await supabase
            .from('laboratory_services')
            .select()
            .limit(1000000)
            .returns<any[]>();

        if (error) {
            console.error('Error fetching laboratory services:', error);
            throw error;
        }

        if (!data) return [];

        return data.map(item => ({
            id: item.id.toString(),
            section: item.section_lab,
            subsection1: item.subsection_1_lab || '',
            subsection2: item.subsection_2_lab || '',
            codeEru: item.kod_eru_lab,
            nameEru: item.name_eru_lab,
            cost: item.price_lab,
            type: 'laboratory' as const
        }));
    }
}; 