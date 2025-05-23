import React from 'react';
import { clinics } from '../data/clinics';
import ClinicCard from '../components/ClinicCard';
import MedicalCross from '../components/Animations/MedicalCross';
import Heartbeat from '../components/Animations/Heartbeat';
import { LogOut, ClipboardList, Microscope, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div>
      {/* Header with Logout Button */}
      <div className="fixed top-0 right-0 p-4 z-50">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-all"
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20">
          <MedicalCross size={80} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <MedicalCross size={60} />
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-30">
          <Heartbeat width={400} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Прейскуранты медицинских услуг
            </h1>
            <div className="flex gap-4 justify-center">
              <a
                href="#clinics"
                className="bg-white text-blue-600 font-medium rounded-lg px-6 py-3 hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Выбрать клинику
              </a>
              <a
                href="#"
                className="bg-transparent border border-white text-white font-medium rounded-lg px-6 py-3 hover:bg-white/10 transition-colors"
              >
                Подробнее
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clinics */}
      <section id="clinics" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Выберите клинику
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section id="references" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Справочники
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/nomenclature"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Номенклатура медицинских услуг
                </h2>
              </div>
              <p className="text-gray-600">
                Приказ Минздрава России от 13.10.2017 N 804н
              </p>
            </Link>

            <Link
              to="/eru"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Единый реестр услуг (ЕРУ)
                </h2>
              </div>
              <p className="text-gray-600">
                Справочник медицинских услуг
              </p>
            </Link>

            <Link
              to="/erlu"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Microscope className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Единый реестр лабораторных услуг (ЕРЛУ)
                </h2>
              </div>
              <p className="text-gray-600">
                Справочник лабораторных услуг
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;