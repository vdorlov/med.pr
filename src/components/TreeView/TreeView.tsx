import React from 'react';
import TreeViewNode from './TreeViewNode';
import { Section } from '../../types';

interface TreeViewProps {
  sections: Section[];
  selectedSections: string[];
  onSelectSection: (sectionId: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  sections,
  selectedSections,
  onSelectSection,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <TreeViewNode
            key={section.id}
            section={section}
            selectedSections={selectedSections}
            onSelectSection={onSelectSection}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeView;