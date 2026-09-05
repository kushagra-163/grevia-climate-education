import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-earth-border bg-earth-secondary py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-earth-primary-light" />
            </div>
            <div>
              <span className="font-black text-earth-text tracking-wide">GREVIA</span>
              <p className="text-xs text-earth-muted">Learn Climate. Take Action. Make an Impact.</p>
            </div>
          </Link>

          <div className="flex items-center space-x-6 text-sm text-earth-muted">
            <Link to="/quiz" className="hover:text-earth-primary-light transition-colors">Adaptive Quiz Engine</Link>
            <span>•</span>
            <Link to="/eco-coach" className="hover:text-earth-primary-light transition-colors">AI Eco-Coach</Link>
            <span>•</span>
            <Link to="/dashboard" className="hover:text-earth-primary-light transition-colors">NASA Data Pipeline</Link>
          </div>

          <div className="text-xs text-earth-subtle flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-earth-accent inline fill-earth-accent" />
            <span>for global sustainability education © {new Date().getFullYear()} Grevia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
