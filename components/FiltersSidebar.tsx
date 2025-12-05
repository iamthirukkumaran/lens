'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  gender: string;
}

const BRANDS = [
  'Arcadio',
  'Titan',
  'Fastrack',
  'Aeropostale',
  'Tommy Hilfiger',
  'Police',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const MATERIALS = [
  'Titanium',
  'Flex Titanium',
  'Stainless Steel',
  'Other Metal',
  'All Metal',
  'Acetate',
];

const COLORS = [
  'Black',
  'Brown',
  'Gold',
  'Silver',
  'Blue',
  'Red',
  'Green',
  'White',
];

export default function FiltersSidebar({ onFilterChange, gender }: FiltersProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    brand: true,
    size: true,
    material: true,
    color: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    colors: [] as string[],
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandChange = (brand: string) => {
    const updated = selectedFilters.brands.includes(brand)
      ? selectedFilters.brands.filter((b) => b !== brand)
      : [...selectedFilters.brands, brand];

    setSelectedFilters((prev) => ({ ...prev, brands: updated }));
  };

  const handleSizeChange = (size: string) => {
    const updated = selectedFilters.sizes.includes(size)
      ? selectedFilters.sizes.filter((s) => s !== size)
      : [...selectedFilters.sizes, size];

    setSelectedFilters((prev) => ({ ...prev, sizes: updated }));
  };

  const handleMaterialChange = (material: string) => {
    const updated = selectedFilters.materials.includes(material)
      ? selectedFilters.materials.filter((m) => m !== material)
      : [...selectedFilters.materials, material];

    setSelectedFilters((prev) => ({ ...prev, materials: updated }));
  };

  const handleColorChange = (color: string) => {
    const updated = selectedFilters.colors.includes(color)
      ? selectedFilters.colors.filter((c) => c !== color)
      : [...selectedFilters.colors, color];

    setSelectedFilters((prev) => ({ ...prev, colors: updated }));
  };

  useEffect(() => {
    onFilterChange({
      brands: selectedFilters.brands,
      sizes: selectedFilters.sizes,
      materials: selectedFilters.materials,
      colors: selectedFilters.colors,
      gender,
    });
  }, [selectedFilters, gender, onFilterChange]);

  const resetFilters = () => {
    setSelectedFilters({ brands: [], sizes: [], materials: [], colors: [] });
  };

  // Check if any filters are selected
  const hasActiveFilters = 
    selectedFilters.brands.length > 0 ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.materials.length > 0 ||
    selectedFilters.colors.length > 0;

  // Get all active filter items
  const activeFilters = [
    ...selectedFilters.brands.map(b => ({ type: 'brand', value: b })),
    ...selectedFilters.sizes.map(s => ({ type: 'size', value: s })),
    ...selectedFilters.materials.map(m => ({ type: 'material', value: m })),
    ...selectedFilters.colors.map(c => ({ type: 'color', value: c })),
  ];

  const removeFilter = (type: string, value: string) => {
    if (type === 'brand') {
      setSelectedFilters(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b !== value)
      }));
    } else if (type === 'size') {
      setSelectedFilters(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== value)
      }));
    } else if (type === 'material') {
      setSelectedFilters(prev => ({
        ...prev,
        materials: prev.materials.filter(m => m !== value)
      }));
    } else if (type === 'color') {
      setSelectedFilters(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== value)
      }));
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-soft">
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}-${index}`}
                className="inline-flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-full text-xs"
              >
                <span>{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="hover:bg-gray-800 rounded-full p-0.5 transition-colors"
                  title="Remove filter"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button - Only show if filters are active */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full mb-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm tracking-widest font-light"
        >
          RESET ALL FILTERS
        </button>
      )}

      {/* Brand Filter */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-sm tracking-widest font-semibold text-gray-900">
            BRAND
          </h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.brand ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.brand && (
          <div className="space-y-4">
            {BRANDS.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-sm tracking-widest font-semibold text-gray-900">
            FRAME SIZE
          </h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.size ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.size && (
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map((size) => (
              <label key={size} className="relative">
                <input
                  type="checkbox"
                  checked={selectedFilters.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="sr-only"
                />
                <div
                  className={`p-3 rounded-lg text-sm font-semibold text-center cursor-pointer transition-all ${
                    selectedFilters.sizes.includes(size)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <button
          onClick={() => toggleSection('material')}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-sm tracking-widest font-semibold text-gray-900">
            FRAME MATERIAL
          </h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.material ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.material && (
          <div className="space-y-4">
            {MATERIALS.map((material) => (
              <label
                key={material}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.materials.includes(material)}
                  onChange={() => handleMaterialChange(material)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div>
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-sm tracking-widest font-semibold text-gray-900">
            FRAME COLOR
          </h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.color ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.color && (
          <div className="space-y-4">
            {COLORS.map((color) => (
              <label
                key={color}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.colors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
