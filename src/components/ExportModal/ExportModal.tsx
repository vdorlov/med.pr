import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ServiceItem } from '../../types';
import * as XLSX from 'xlsx';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    ambulatoryData: ServiceItem[];
    laboratoryData: ServiceItem[];
    selectedSections: string[];
    activeTab: 'outpatient-inpatient' | 'laboratory';
}

type TableSelection = 'outpatient-inpatient' | 'laboratory' | 'both';

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    ambulatoryData,
    laboratoryData,
    selectedSections,
    activeTab
}) => {
    const [selectedTables, setSelectedTables] = useState<TableSelection>(activeTab === 'both' ? 'both' : activeTab);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const headers = ['Раздел', 'Подраздел 1', 'Подраздел 2', 'Код ЕРУ', 'Наименование ЕРУ', 'Стоимость'];

    const prepareData = (data: ServiceItem[]) => {
        // Фильтруем данные по выбранным секциям
        let exportData = data;
        if (selectedSections.length > 0) {
            const selectedSectionSet = new Set(selectedSections);
            exportData = data.filter(item =>
                selectedSectionSet.has(item.section) ||
                selectedSectionSet.has(`${item.section}-${item.subsection1}`) ||
                selectedSectionSet.has(`${item.section}-${item.subsection1}-${item.subsection2}`)
            );
        }

        // Преобразуем данные в формат для экспорта
        return exportData.map(item => [
            item.section,
            item.subsection1,
            item.subsection2,
            item.codeEru,
            item.nameEru,
            item.cost.toLocaleString('ru') + ' ₽'
        ]);
    };

    const exportToExcel = (ambulatoryRows: string[][], laboratoryRows: string[][]) => {
        const wb = XLSX.utils.book_new();

        // Общие настройки для столбцов
        const colWidths = [
            { wch: 20 }, // Раздел
            { wch: 20 }, // Подраздел 1
            { wch: 20 }, // Подраздел 2
            { wch: 15 }, // Код ЕРУ
            { wch: 50 }, // Наименование ЕРУ
            { wch: 15 }, // Стоимость
        ];

        // Добавляем лист с амбулаторными услугами
        if (selectedTables === 'outpatient-inpatient' || selectedTables === 'both') {
            const wsAmb = XLSX.utils.aoa_to_sheet([headers, ...ambulatoryRows]);
            wsAmb['!cols'] = colWidths;
            XLSX.utils.book_append_sheet(wb, wsAmb, 'Амбулаторные услуги');
        }

        // Добавляем лист с лабораторными услугами
        if (selectedTables === 'laboratory' || selectedTables === 'both') {
            const wsLab = XLSX.utils.aoa_to_sheet([headers, ...laboratoryRows]);
            wsLab['!cols'] = colWidths;
            XLSX.utils.book_append_sheet(wb, wsLab, 'Лабораторные услуги');
        }

        // Генерируем имя файла и сохраняем
        const fileName = `price-list-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const ambulatoryRows = prepareData(ambulatoryData);
            const laboratoryRows = prepareData(laboratoryData);
            exportToExcel(ambulatoryRows, laboratoryRows);
            onClose();
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Произошла ошибка при экспорте данных');
        } finally {
            setIsExporting(false);
        }
    };

    const getTotalCount = () => {
        let count = 0;
        if (selectedTables === 'outpatient-inpatient' || selectedTables === 'both') {
            count += ambulatoryData.length;
        }
        if (selectedTables === 'laboratory' || selectedTables === 'both') {
            count += laboratoryData.length;
        }
        return count;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Экспорт прейскуранта</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Выберите таблицы для экспорта
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="outpatient-inpatient"
                                        checked={selectedTables === 'outpatient-inpatient'}
                                        onChange={(e) => setSelectedTables(e.target.value as TableSelection)}
                                        className="mr-2"
                                    />
                                    <span>Амбулаторные и стационарные услуги ({ambulatoryData.length})</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="laboratory"
                                        checked={selectedTables === 'laboratory'}
                                        onChange={(e) => setSelectedTables(e.target.value as TableSelection)}
                                        className="mr-2"
                                    />
                                    <span>Лабораторные услуги ({laboratoryData.length})</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="both"
                                        checked={selectedTables === 'both'}
                                        onChange={(e) => setSelectedTables(e.target.value as TableSelection)}
                                        className="mr-2"
                                    />
                                    <span>Обе таблицы ({ambulatoryData.length + laboratoryData.length})</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">
                                Будет выгружено: {getTotalCount()} записей
                                {selectedSections.length > 0 && ' (с учетом выбранных фильтров)'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Файл будет сохранен в формате Excel (.xlsx)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Экспорт...
                            </>
                        ) : (
                            'Экспортировать'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal; 