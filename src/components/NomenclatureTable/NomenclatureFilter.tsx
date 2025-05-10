import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NomenclatureItem {
    id: string;
    section: string;
    serviceType: string;
    serviceClass: string;
    codeMinzdrav: string;
    nameMinzdrav: string;
}

interface NomenclatureFilterProps {
    data: NomenclatureItem[];
    onFilterChange: (filters: { section: string; serviceType: string; serviceClass: string }) => void;
}

interface TreeNode {
    name: string;
    children: { [key: string]: TreeNode };
    count: number;
}

const NomenclatureFilter: React.FC<NomenclatureFilterProps> = ({ data, onFilterChange }) => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const [expandedTypes, setExpandedTypes] = useState<{ [key: string]: boolean }>({});
    const [selectedFilters, setSelectedFilters] = useState({
        section: '',
        serviceType: '',
        serviceClass: ''
    });

    const treeData = useMemo(() => {
        const tree: { [key: string]: TreeNode } = {};

        data.forEach(item => {
            // Добавляем раздел
            if (!tree[item.section]) {
                tree[item.section] = {
                    name: item.section,
                    children: {},
                    count: 0
                };
            }
            tree[item.section].count++;

            // Добавляем тип услуги
            if (!tree[item.section].children[item.serviceType]) {
                tree[item.section].children[item.serviceType] = {
                    name: item.serviceType,
                    children: {},
                    count: 0
                };
            }
            tree[item.section].children[item.serviceType].count++;

            // Добавляем класс услуги
            if (!tree[item.section].children[item.serviceType].children[item.serviceClass]) {
                tree[item.section].children[item.serviceType].children[item.serviceClass] = {
                    name: item.serviceClass,
                    children: {},
                    count: 0
                };
            }
            tree[item.section].children[item.serviceType].children[item.serviceClass].count++;
        });

        return tree;
    }, [data]);

    const handleSectionClick = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleTypeClick = (section: string, type: string) => {
        setExpandedTypes(prev => ({
            ...prev,
            [`${section}-${type}`]: !prev[`${section}-${type}`]
        }));
    };

    const handleFilterSelect = (section: string, type: string = '', serviceClass: string = '') => {
        const newFilters = {
            section: section,
            serviceType: type,
            serviceClass: serviceClass
        };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Фильтр по разделам</div>
            <div className="flex flex-wrap gap-2">
                {Object.entries(treeData).map(([section, sectionData]) => (
                    <div key={section} className="text-sm">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleSectionClick(section)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {expandedSections[section] ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                )}
                            </button>
                            <button
                                onClick={() => handleFilterSelect(section)}
                                className={`text-left px-2 py-1 rounded hover:bg-gray-100 text-[11px] ${selectedFilters.section === section && !selectedFilters.serviceType
                                        ? 'bg-blue-50 text-blue-600'
                                        : ''
                                    }`}
                            >
                                {section} ({sectionData.count})
                            </button>
                        </div>
                        {expandedSections[section] && (
                            <div className="ml-4 mt-1 flex flex-wrap gap-2">
                                {Object.entries(sectionData.children).map(([type, typeData]) => (
                                    <div key={type} className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleTypeClick(section, type)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {expandedTypes[`${section}-${type}`] ? (
                                                <ChevronDown size={14} />
                                            ) : (
                                                <ChevronRight size={14} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleFilterSelect(section, type)}
                                            className={`text-left px-2 py-1 rounded hover:bg-gray-100 text-[11px] ${selectedFilters.section === section &&
                                                    selectedFilters.serviceType === type &&
                                                    !selectedFilters.serviceClass
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : ''
                                                }`}
                                        >
                                            {type} ({typeData.count})
                                        </button>
                                        {expandedTypes[`${section}-${type}`] && (
                                            <div className="ml-4 mt-1 flex flex-wrap gap-2">
                                                {Object.entries(typeData.children).map(([serviceClass, classData]) => (
                                                    <button
                                                        key={serviceClass}
                                                        onClick={() => handleFilterSelect(section, type, serviceClass)}
                                                        className={`text-left px-2 py-1 rounded hover:bg-gray-100 text-[11px] ${selectedFilters.section === section &&
                                                                selectedFilters.serviceType === type &&
                                                                selectedFilters.serviceClass === serviceClass
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : ''
                                                            }`}
                                                    >
                                                        {serviceClass} ({classData.count})
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NomenclatureFilter; 