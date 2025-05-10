export type Clinic = {
  id: string;
  name: string;
  logo?: string;
};

export type ServiceType = 'outpatient-inpatient' | 'laboratory';

export type ServiceItem = {
  id: string;
  section: string;
  subsection1: string;
  subsection2: string;
  subsection3: string;
  codeEru: string;
  nameEru: string;
  cost: number;
  type: ServiceType;
};

export type Section = {
  id: string;
  name: string;
  children?: Section[];
};