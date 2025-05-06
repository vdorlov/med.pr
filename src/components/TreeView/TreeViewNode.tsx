import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Section } from '../../types';

interface TreeViewNodeProps {
  section: Section;
  selectedSections: string[];
  onSelectSection: (sectionId: string) => void;
}

const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  section,
  selectedSections,
  onSelectSection,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = section.children && section.children.length > 0;
  const isSelected = selectedSections.includes(section.id);
  
  return (
    <div className="inline-flex flex-col">
      <div 
        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
          isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }`}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-1 focus:outline-none"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : null}
        
        <button
          onClick={() => onSelectSection(section.id)}
          className="focus:outline-none"
        >
          {section.name}
        </button>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 flex flex-wrap gap-1">
          {section.children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelectSection(child.id)}
              className={`px-2 py-1 rounded text-sm ${
                selectedSections.includes(child.id)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {child.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeViewNode;