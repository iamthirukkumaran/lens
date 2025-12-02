'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-soft">
      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full mb-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm tracking-widest font-light"
      >
        RESET FILTERS
      </button>

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
