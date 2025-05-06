export interface Database {
    public: {
        Tables: {
            ambulatory_stationary_services: {
                Row: {
                    id: number;
                    section: string;
                    subsection_1: string | null;
                    subsection_2: string | null;
                    kod_eru: string;
                    name_eru: string;
                    price: number;
                };
                Insert: Omit<Database['public']['Tables']['ambulatory_stationary_services']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['ambulatory_stationary_services']['Row']>;
            };
            laboratory_services: {
                Row: {
                    id: number;
                    section_lab: string;
                    subsection_1_lab: string | null;
                    subsection_2_lab: string | null;
                    kod_eru_lab: string;
                    name_eru_lab: string;
                    price_lab: number;
                };
                Insert: Omit<Database['public']['Tables']['laboratory_services']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['laboratory_services']['Row']>;
            };
        };
    };
} 