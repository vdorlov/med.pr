import React from 'react';
import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-red-400 animate-pulse" size={28} />
          <span className="text-2xl font-bold">МедПрайс</span>
        </Link>
        
        {location.pathname !== '/' && (
          <nav className="mt-4">
            <Link 
              to="/"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Главная
            </Link>
            <span className="mx-2 text-blue-300">›</span>
            <span className="text-white font-medium">
              {location.pathname.includes('/clinic/') && 'Прейскурант клиники'}
            </span>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;