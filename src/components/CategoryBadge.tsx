import React from 'react';
import type { BPCategory } from '../utils/bloodPressure';

interface Props {
  category: BPCategory;
  showDescription?: boolean;
}

export function CategoryBadge({ category, showDescription = false }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${category.colorClass}`}
      >
        {category.name}
      </span>
      {showDescription && (
        <p className="text-sm text-gray-600">{category.description}</p>
      )}
    </div>
  );
}