import React from 'react';
import { ServiceType } from '../types';

interface ServiceTabsProps {
  activeTab: ServiceType;
  onTabChange: (tab: ServiceType) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        className={`py-2 px-4 text-sm font-medium border-b-2 ${
          activeTab === 'outpatient-inpatient'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } transition-colors`}
        onClick={() => onTabChange('outpatient-inpatient')}
      >
        Амбулаторные и стационарные услуги
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium border-b-2 ${
          activeTab === 'laboratory'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } transition-colors`}
        onClick={() => onTabChange('laboratory')}
      >
        Лабораторные услуги
      </button>
    </div>
  );
};

export default ServiceTabs;