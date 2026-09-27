import React from 'react';
import { Tag } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
          selectedCategory === ''
            ? 'bg-brand-600 text-white shadow-md shadow-brand-950/50'
            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory.toLowerCase() === cat.toLowerCase()
              ? 'bg-brand-600 text-white shadow-md shadow-brand-950/50'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
