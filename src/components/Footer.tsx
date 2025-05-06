import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="text-red-400" size={20} />
            <span className="text-lg font-bold">МедПрайс</span>
          </div>
          
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} МедПрайс. Все права защищены.
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">О сервисе</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Контакты</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Помощь</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;