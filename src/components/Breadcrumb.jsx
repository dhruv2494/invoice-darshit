import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [hoveredCrumb, setHoveredCrumb] = useState(null);

  // Function to make breadcrumb name more readable
  const formatBreadcrumb = (name) => {
    if (!name) return 'Home';
    
    // Replace hyphens with spaces and capitalize first letter of each word
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Update breadcrumbs when location changes
  useEffect(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        name: formatBreadcrumb(name),
        path: routeTo,
        isLast: index === pathnames.length - 1
      };
    });
    
    // Add home breadcrumb if not on home page
    if (location.pathname !== '/') {
      breadcrumbs.unshift({ name: 'Home', path: '/', isLast: false });
    }
    
    setBreadcrumbs(breadcrumbs);
  }, [location]);

  const handleCrumbClick = (path, isLast) => {
    if (!isLast) {
      navigate(path);
    }
  };

  return (
    <nav 
      className="relative px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm"
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.ol 
            className="flex items-center space-x-1 overflow-x-auto py-1 hide-scrollbar"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {breadcrumbs.map((crumb, index) => (
              <motion.li 
                key={`${crumb.path}-${index}`}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCrumb(index)}
                onMouseLeave={() => setHoveredCrumb(null)}
              >
                {index > 0 && (
                  <FiChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                )}
                
                <motion.div
                  className={`relative px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer ${!crumb.isLast ? 'hover:bg-white hover:shadow-sm' : ''}`}
                  onClick={() => handleCrumbClick(crumb.path, crumb.isLast)}
                  whileHover={!crumb.isLast ? { scale: 1.03 } : {}}
                  whileTap={!crumb.isLast ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center">
                    {index === 0 && !location.pathname.includes('home') && (
                      <FiHome className="w-4 h-4 mr-2 text-blue-600" />
                    )}
                    <span className={`text-sm font-medium whitespace-nowrap ${crumb.isLast ? 'text-blue-700 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}>
                      {crumb.name}
                    </span>
                  </div>
                  
                  {!crumb.isLast && (
                    <motion.div 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-200"
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: hoveredCrumb === index ? 1 : 0,
                        originX: 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
      
      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumb;
