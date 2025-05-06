import React from 'react';
import { Link } from 'react-router-dom';
import { Clinic } from '../types';
import { Stethoscope } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  return (
    <Link 
      to={`/clinic/${clinic.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 group"
    >
      <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center p-4">
        {clinic.logo ? (
          <img src={clinic.logo} alt={clinic.name} className="h-full object-contain" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Stethoscope size={36} className="text-white group-hover:scale-110 transition-transform" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {clinic.name}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Нажмите для просмотра прейскуранта
        </p>
      </div>
    </Link>
  );
};

export default ClinicCard;