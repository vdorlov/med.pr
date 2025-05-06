import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface Section {
    id: string;
    name: string;
    children?: Section[];
}

interface SectionFilterProps {
    sections: Section[];
    selectedSections: string[];
    onSelectSection: (sectionId: string) => void;
    onClearFilter: () => void;
}

const sortSections = (sections: Section[]): Section[] => {
    return [...sections].sort((a, b) => a.name.localeCompare(b.name)).map(section => ({
        ...section,
        children: section.children ? sortSections(section.children) : undefined
    }));
};

const SectionNode: React.FC<{
    section: Section;
    selectedSections: string[];
    onSelectSection: (sectionId: string) => void;
    level: number;
}> = ({ section, selectedSections, onSelectSection, level }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = section.children && section.children.length > 0;
    const isSelected = selectedSections.includes(section.id);

    const sortedChildren = useMemo(() => {
        return hasChildren ? sortSections(section.children!) : [];
    }, [section.children]);

    return (
        <div className="w-full">
            <div
                className={`
          flex items-center w-full px-3 py-2 text-sm
          ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
          ${level === 0 ? 'font-medium' : ''}
          transition-colors cursor-pointer
        `}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="mr-2 focus:outline-none"
                    >
                        {isExpanded ? (
                            <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                            <ChevronRight size={16} className="text-gray-500" />
                        )}
                    </button>
                )}
                <div
                    className="flex-grow"
                    onClick={() => onSelectSection(section.id)}
                >
                    {section.name}
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="w-full">
                    {sortedChildren.map((child) => (
                        <SectionNode
                            key={child.id}
                            section={child}
                            selectedSections={selectedSections}
                            onSelectSection={onSelectSection}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const SectionFilter: React.FC<SectionFilterProps> = ({
    sections,
    selectedSections,
    onSelectSection,
    onClearFilter
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const sortedSections = useMemo(() => {
        return sortSections(sections);
    }, [sections]);

    // Автоматически скрываем фильтр при сбросе
    const handleClearFilter = () => {
        onClearFilter();
        setIsExpanded(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200"
            >
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Фильтр по разделам</span>
                    {selectedSections.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {selectedSections.length}
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-500" />
                ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                )}
            </button>

            {isExpanded && (
                <div className="divide-y divide-gray-100">
                    {sortedSections.map((section) => (
                        <SectionNode
                            key={section.id}
                            section={section}
                            selectedSections={selectedSections}
                            onSelectSection={onSelectSection}
                            level={0}
                        />
                    ))}

                    {selectedSections.length > 0 && (
                        <div className="p-3 bg-gray-50">
                            <button
                                onClick={handleClearFilter}
                                className="w-full px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Сбросить фильтр разделов
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionFilter; 