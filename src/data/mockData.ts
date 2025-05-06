import { ServiceItem } from '../types';

// Mock data for ambulatory and stationary services
export const mockOutpatientInpatientServices: ServiceItem[] = [
  {
    id: 'amb-1',
    section: 'Кардиология',
    subsection1: 'Диагностика',
    subsection2: 'Базовые исследования',
    codeEru: 'ERU-1001',
    nameEru: 'Электрокардиография (ЭКГ)',
    cost: 2500,
    type: 'outpatient-inpatient'
  },
  {
    id: 'amb-2',
    section: 'Неврология',
    subsection1: 'Консультации',
    subsection2: 'Первичный прием',
    codeEru: 'ERU-2001',
    nameEru: 'Консультация врача-невролога',
    cost: 3500,
    type: 'outpatient-inpatient'
  },
  {
    id: 'amb-3',
    section: 'Терапия',
    subsection1: 'Процедуры',
    subsection2: 'Инъекции',
    codeEru: 'ERU-3001',
    nameEru: 'Внутривенное капельное введение лекарственных препаратов',
    cost: 1800,
    type: 'outpatient-inpatient'
  }
];

// Mock data for laboratory services
export const mockLaboratoryServices: ServiceItem[] = [
  {
    id: 'lab-1',
    section: 'Биохимия',
    subsection1: 'Печеночные пробы',
    subsection2: 'Базовая панель',
    codeEru: 'ERU-L1001',
    nameEru: 'Биохимический анализ крови (базовый)',
    cost: 1500,
    type: 'laboratory'
  },
  {
    id: 'lab-2',
    section: 'Гематология',
    subsection1: 'Общие анализы',
    subsection2: 'Стандартные исследования',
    codeEru: 'ERU-L2001',
    nameEru: 'Общий анализ крови с лейкоцитарной формулой',
    cost: 900,
    type: 'laboratory'
  },
  {
    id: 'lab-3',
    section: 'Иммунология',
    subsection1: 'Антитела',
    subsection2: 'Специфические маркеры',
    codeEru: 'ERU-L3001',
    nameEru: 'Определение антител к COVID-19 (IgG, IgM)',
    cost: 2200,
    type: 'laboratory'
  }
];