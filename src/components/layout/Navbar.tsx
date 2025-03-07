
import React from 'react';
import { Zap, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b border-neutral-800 backdrop-blur-lg fixed top-0 z-50 bg-neutral-900/90">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="font-medium text-xl text-neutral-100">Ultimate Cell Tester</div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-neutral-300 hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/labels" className="text-neutral-300 hover:text-primary transition-colors">Print Labels</Link>
          <Link to="/repacker" className="text-neutral-300 hover:text-primary transition-colors">
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              Repacker
            </span>
          </Link>
          <Link to="#" className="text-neutral-300 hover:text-primary transition-colors">History</Link>
          <Link to="#" className="text-neutral-300 hover:text-primary transition-colors">Settings</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="py-1.5 px-3 rounded-md border border-neutral-700 text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">
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
