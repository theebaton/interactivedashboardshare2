import React from 'react';
import { FilterState } from '../types';
import { Search, Filter, Calendar } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  types: string[];
  departments: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, types, departments }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 font-sans border-l-4 border-kku-primary">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
        <Filter className="mr-2 h-5 w-5 text-kku-primary" />
        ตัวกรองและค้นหา
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Subject */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">ค้นหาตามเรื่อง</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="พิมพ์ชื่อเรื่อง..."
              value={filters.searchSubject}
              onChange={(e) => handleChange('searchSubject', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
            />
          </div>
        </div>

        {/* Search Personnel */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">ค้นหาตามชื่อบุคลากร</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="พิมพ์ชื่อ-นามสกุล..."
              value={filters.searchPersonnel}
              onChange={(e) => handleChange('searchPersonnel', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
            />
          </div>
        </div>

        {/* Filter Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ประเภทเอกสาร</label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
          >
            <option value="">ทั้งหมด</option>
            {types.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Filter Department */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">หน่วยงานที่ประกาศ</label>
          <select
            value={filters.issuingDept}
            onChange={(e) => handleChange('issuingDept', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
          >
            <option value="">ทั้งหมด</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Date Range Start */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ตั้งแต่วันที่</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
            />
          </div>
        </div>

        {/* Date Range End */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ถึงวันที่</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;