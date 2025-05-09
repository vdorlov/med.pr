import React from 'react';
import { clinics } from '../data/clinics';
import ClinicCard from '../components/ClinicCard';
import MedicalCross from '../components/Animations/MedicalCross';
import Heartbeat from '../components/Animations/Heartbeat';
import { LogOut } from 'lucide-react';
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
              to="/reference/804n"
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.5 12h15m-15 4h15m-7.5-8h7.5m-15 0h7.5"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Номенклатура медицинских услуг</h2>
                  <p className="text-sm text-gray-600">Приказ 804н</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;