
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t border-neutral-200 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-neutral-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Ultimate Cell Tester. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
