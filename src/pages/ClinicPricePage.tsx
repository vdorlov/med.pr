import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import ServiceTable from '../components/ServiceTable/ServiceTable';
import ServiceTabs from '../components/ServiceTabs';
import SectionFilter from '../components/SectionFilter/SectionFilter';
import ExportModal from '../components/ExportModal/ExportModal';
import { clinics } from '../data/clinics';
import { priceListService } from '../services/priceListService';
import { ServiceItem } from '../types';

const ClinicPricePage: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [activeTab, setActiveTab] = useState<'outpatient-inpatient' | 'laboratory'>('outpatient-inpatient');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ambulatoryServices, setAmbulatoryServices] = useState<ServiceItem[]>([]);
  const [laboratoryServices, setLaboratoryServices] = useState<ServiceItem[]>([]);

  const clinic = clinics.find(c => c.id === clinicId);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [ambulatoryData, laboratoryData] = await Promise.all([
          priceListService.getAmbulatoryStationaryServices(),
          priceListService.getLaboratoryServices()
        ]);

        setAmbulatoryServices(ambulatoryData);
        setLaboratoryServices(laboratoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const services = useMemo(() => {
    return activeTab === 'outpatient-inpatient' ? ambulatoryServices : laboratoryServices;
  }, [activeTab, ambulatoryServices, laboratoryServices]);

  const sections = useMemo(() => {
    const currentServices = services;
    const sectionMap = new Map<string, Map<string, Set<string>>>();

    currentServices.forEach(service => {
      const section = service.section;
      const subsection1 = service.subsection1;
      const subsection2 = service.subsection2;

      if (!sectionMap.has(section)) {
        sectionMap.set(section, new Map());
      }

      const subsectionsMap = sectionMap.get(section)!;

      if (subsection1) {
        if (!subsectionsMap.has(subsection1)) {
          subsectionsMap.set(subsection1, new Set());
        }
        if (subsection2) {
          subsectionsMap.get(subsection1)?.add(subsection2);
        }
      }
    });

    return Array.from(sectionMap.entries()).map(([section, subsections]) => ({
      id: section,
      name: section,
      children: Array.from(subsections.entries()).map(([sub1, sub2Set]) => ({
        id: `${section}-${sub1}`,
        name: sub1,
        children: Array.from(sub2Set).map(sub2 => ({
          id: `${section}-${sub1}-${sub2}`,
          name: sub2
        }))
      }))
    }));
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedSections.length === 0) {
      return services;
    }

    const selectedSectionNames = new Map<string, Set<string>>();

    const collectSectionNames = (sections: any[], ids: string[]) => {
      for (const section of sections) {
        if (ids.includes(section.id)) {
          if (!selectedSectionNames.has(section.name)) {
            selectedSectionNames.set(section.name, new Set());
          }
        }

        if (section.children && section.children.length > 0) {
          for (const child of section.children) {
            if (ids.includes(child.id)) {
              selectedSectionNames.get(section.name)?.add(child.name);
            }
            if (child.children && child.children.length > 0) {
              for (const subChild of child.children) {
                if (ids.includes(subChild.id)) {
                  selectedSectionNames.get(section.name)?.add(subChild.name);
                }
              }
            }
          }
          collectSectionNames(section.children, ids);
        }
      }
    };

    collectSectionNames(sections, selectedSections);

    return services.filter(service => {
      for (const [section, subsections] of selectedSectionNames) {
        if (service.section === section) {
          if (subsections.size === 0) return true;
          return subsections.has(service.subsection1) || subsections.has(service.subsection2);
        }
      }
      return false;
    });
  }, [services, selectedSections, sections]);

  const handleSelectSection = (sectionId: string) => {
    setSelectedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  const handleClearAllFilters = () => {
    setSelectedSections([]);
  };

  const handleExport = (format: 'excel' | 'pdf', sections: string[]) => {
    console.log('Экспорт в формате:', format, 'разделы:', sections);
  };

  if (!clinic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Клиника не найдена</h2>
        <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Вернуться на главную
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ошибка загрузки данных</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:underline inline-flex items-center"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Вернуться на главную
        </Link>

        <div className="mt-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Прейскурант клиники {clinic.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Актуальные цены на медицинские услуги
            </p>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Выгрузить прейскурант</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <ServiceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="text-sm text-gray-600">
          Всего услуг: {services.length}
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Загрузка данных...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-600 hover:underline"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            <SectionFilter
              sections={sections}
              selectedSections={selectedSections}
              onSelectSection={handleSelectSection}
              onClearFilter={handleClearAllFilters}
            />

            <ServiceTable
              data={services}
              filteredData={filteredServices}
              onClearAllFilters={handleClearAllFilters}
            />
          </>
        )}
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default ClinicPricePage