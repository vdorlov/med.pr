import React from 'react';
import { X } from 'lucide-react';

interface ERUModalProps {
    isOpen: boolean;
    onClose: () => void;
    eruData: {
        id: string;
        section: string;
        subsection_1: string;
        subsection_2: string;
        kod_eru: string;
        name_eru: string;
        kod_nomen: string;
        name_nomen: string;
        active: boolean;
        nds: boolean;
        tech_card: boolean;
        interpretator: string;
        date_input: string;
        date_change: string;
        [key: string]: any;
    } | null;
}

const ERUModal: React.FC<ERUModalProps> = ({ isOpen, onClose, eruData }) => {
    if (!isOpen || !eruData) return null;

    // Функция для форматирования даты
    const formatDate = (dateString: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Функция для форматирования булевых значений
    const formatBoolean = (value: boolean, trueText: string, falseText: string): string => {
        return value ? trueText : falseText;
    };

    // Функция для определения цвета статуса
    const getStatusColor = (value: boolean): string => {
        return value
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200';
    };

    // Основная информация
    const mainInfo = [
        { label: 'Раздел', value: eruData.section },
        { label: 'Подраздел 1', value: eruData.subsection_1 || '-' },
        { label: 'Подраздел 2', value: eruData.subsection_2 || '-' },
        { label: 'Код ЕРУ', value: eruData.kod_eru },
        { label: 'Наименование ЕРУ', value: eruData.name_eru },
        { label: 'Код Минздрава', value: eruData.kod_nomen || '-' },
        { label: 'Наименование Минздрава', value: eruData.name_nomen || '-' },
    ];

    // Дополнительная информация
    const additionalInfo = [
        {
            label: 'Активность',
            value: formatBoolean(eruData.active, 'Действующая', 'Архивированная'),
            isStatus: true,
            statusValue: eruData.active
        },
        {
            label: 'НДС',
            value: formatBoolean(eruData.nds, '20%', 'Нет'),
            isStatus: true,
            statusValue: eruData.nds
        },
        {
            label: 'Технологическая карта',
            value: formatBoolean(eruData.tech_card, 'Есть', 'Нет'),
            isStatus: true,
            statusValue: eruData.tech_card
        },
        {
            label: 'Дата ввода',
            value: formatDate(eruData.date_input)
        },
        {
            label: 'Дата изменения',
            value: formatDate(eruData.date_change)
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Детальная информация об услуге
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Основная информация */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {mainInfo.map(({ label, value }) => (
                                <div key={label} className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-500 mb-1">
                                        {label}
                                    </span>
                                    <span className={`text-sm break-words p-2 rounded-md border ${value !== '-' ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Дополнительная информация */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {additionalInfo.map(({ label, value, isStatus, statusValue }) => (
                                <div key={label} className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-500 mb-1">
                                        {label}
                                    </span>
                                    <span className={`text-sm break-words p-2 rounded-md border ${isStatus
                                        ? getStatusColor(statusValue)
                                        : value !== '-'
                                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Толкователь медицинских услуг */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Толкователь медицинских услуг</h3>
                        <div className={`p-4 rounded-lg border ${eruData.interpretator
                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                            <p className="text-sm whitespace-pre-wrap">
                                {eruData.interpretator || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ERUModal; 