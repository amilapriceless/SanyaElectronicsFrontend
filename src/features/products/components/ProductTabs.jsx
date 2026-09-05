import React from 'react';

export const CATEGORIES = [
  'All Products',
  'Refrigerators',
  'MiniBar',
  'Televisions',
  'Washing Machines',
  'Buffle',
  'Hot Water Showers',
  'Water Motors',
  'Gas Cookers',
  'Furniture Items',
  'Cleaners',
  'Blenders',
  'AC',
  'Accessory Items',
];

const ProductTabs = ({ activeCategory, onSelectCategory, counts = {} }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-16 z-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-3.5 no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const count = counts[category];

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-cyan-400 ring-offset-1'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{category}</span>
                {count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
