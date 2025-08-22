import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  LoaneeTracker
                </span>
                <span className="text-xs text-gray-500 font-medium">⚽ Follow the Journey</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <a
              href="/"
              className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-none bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl`}
            >
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
