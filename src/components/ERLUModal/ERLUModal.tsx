import React from 'react';
import { X } from 'lucide-react';

interface ERLUModalProps {
    isOpen: boolean;
    onClose: () => void;
    erluData: {
        id: string;
        section: string;
        subsection1: string;
        subsection2: string;
        codeErlu: string;
        nameErlu: string;
        codeMinzdrav: string;
        nameMinzdrav: string;
        active: boolean;
        [key: string]: any;
    } | null;
}

const ERLUModal: React.FC<ERLUModalProps> = ({ isOpen, onClose, erluData }) => {
    if (!isOpen || !erluData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Детальная информация
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Раздел
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {erluData.section}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Подраздел 1
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {erluData.subsection1}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Подраздел 2
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {erluData.subsection2}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Код ЕРЛУ
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
                                    {erluData.codeErlu}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Наименование ЕРЛУ
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {erluData.nameErlu}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Код Минздрава
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
                                    {erluData.codeMinzdrav}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Наименование Минздрава
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {erluData.nameMinzdrav}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ERLUModal; 