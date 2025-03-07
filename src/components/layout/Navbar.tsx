
import React from 'react';
import { Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full glass border-b border-neutral-200/50 backdrop-blur-lg fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="font-medium text-xl">Ultimate Cell Tester</div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="text-neutral-600 hover:text-primary transition-colors">History</a>
          <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Settings</a>
          <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Help</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="py-1.5 px-3 rounded-md border border-neutral-200 text-sm font-medium hover:bg-neutral-100 transition-colors">
            Connect
          </button>
          
          <button className="py-1.5 px-3 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
