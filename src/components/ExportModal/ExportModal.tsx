import React, { useState } from 'react';
import { FileSpreadsheet, FileText, X } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'excel' | 'pdf', sections: string[]) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

    if (!isOpen) return null;

    const handleExport = () => {
        if (selectedSections.length === 0) return;
        onExport(exportFormat, selectedSections);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Выгрузка прейскуранта</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Выберите разделы</label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedSections.includes('outpatient-inpatient')}
                                    onChange={(e) => {
                                        setSelectedSections(prev => {
                                            if (e.target.checked) {
                                                return [...prev, 'outpatient-inpatient'];
                                            }
                                            return prev.filter(s => s !== 'outpatient-inpatient');
                                        });
                                    }}
                                />
                                <span className="text-sm text-gray-700">Амбулаторные и стационарные услуги</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedSections.includes('laboratory')}
                                    onChange={(e) => {
                                        setSelectedSections(prev => {
                                            if (e.target.checked) {
                                                return [...prev, 'laboratory'];
                                            }
                                            return prev.filter(s => s !== 'laboratory');
                                        });
                                    }}
                                />
                                <span className="text-sm text-gray-700">Лабораторные услуги</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Формат файла</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setExportFormat('excel')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${exportFormat === 'excel'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <FileSpreadsheet size={20} />
                                <span className="text-sm font-medium">Excel</span>
                            </button>
                            <button
                                onClick={() => setExportFormat('pdf')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${exportFormat === 'pdf'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <FileText size={20} />
                                <span className="text-sm font-medium">PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={selectedSections.length === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${selectedSections.length === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Выгрузить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal; 