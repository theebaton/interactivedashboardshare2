import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { RefreshCw, Bot, Link as LinkIcon, AlertCircle, Database, LayoutDashboard } from 'lucide-react';
import { CSV_DATA } from './constants';
import { DocumentData, FilterState, RawCsvRow } from './types';
import { transformData } from './utils';
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import DocumentTable from './components/DocumentTable';
import FilterBar from './components/FilterBar';

const App: React.FC = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingCustomData, setUsingCustomData] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    startDate: '',
    endDate: '',
    issuingDept: '',
    searchSubject: '',
    searchPersonnel: '',
  });

  const loadDefaultData = () => {
    setIsLoading(true);
    Papa.parse<RawCsvRow>(CSV_DATA, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transformed = results.data.map(transformData);
        setData(transformed);
        setLastUpdated(new Date());
        setUsingCustomData(false);
        setError(null);
        setIsLoading(false);
      },
      error: (err: any) => {
        console.error("Default data parse error", err);
        setIsLoading(false);
      }
    });
  };

  const handleConnectSheet = async () => {
    if (!sheetUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(sheetUrl);
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse<RawCsvRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const transformed = results.data.map(transformData);
            setData(transformed);
            setLastUpdated(new Date());
            setUsingCustomData(true);
            setError(null);
          } else {
            setError("ไม่พบข้อมูลในไฟล์ หรือรูปแบบ CSV ไม่ถูกต้อง");
          }
          setIsLoading(false);
        },
        error: (err: any) => {
          setError(`CSV Parsing Error: ${err.message}`);
          setIsLoading(false);
        }
      });
    } catch (err: any) {
      setError(`ไม่สามารถดึงข้อมูลได้: ${err.message}. ตรวจสอบว่าลิงก์เป็น 'Published to web' (CSV)`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultData();
  }, []);

  const uniqueTypes = useMemo(() => Array.from(new Set(data.map(d => d.type).filter(Boolean))), [data]);
  const uniqueDepts = useMemo(() => Array.from(new Set(data.map(d => d.issuingDepartment).filter(Boolean))), [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.issuingDept && item.issuingDepartment !== filters.issuingDept) return false;
      if (filters.searchSubject && !item.subject.toLowerCase().includes(filters.searchSubject.toLowerCase())) return false;
      if (filters.searchPersonnel && !item.personnel.toLowerCase().includes(filters.searchPersonnel.toLowerCase())) return false;
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0,0,0,0);
        if (item.docDate) {
           const d = new Date(item.docDate);
           d.setHours(0,0,0,0);
           if (d < start) return false;
        } else { return false; }
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23,59,59,999);
        if (item.docDate) {
           if (item.docDate > end) return false;
        } else { return false; }
      }
      return true;
    });
  }, [data, filters]);

  const uniqueDocsCount = new Set(filteredData.map(d => d.id || d.docNumber)).size;
  const uniquePersonnelCount = new Set(filteredData.map(d => d.personnel).filter(Boolean)).size;
  
  const latestDateStr = filteredData
    .map(d => d.docDate)
    .filter(d => d !== null)
    .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0];
    
  const latestFormatted = latestDateStr ? latestDateStr.toLocaleDateString('th-TH', { dateStyle: 'medium' }) : '-';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header - Updated to ADOS */}
      <header className="bg-gradient-to-r from-kku-dark to-kku-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-display leading-tight tracking-tight">ADOS</h1>
                <p className="text-xs text-orange-100 opacity-90 font-light hidden sm:block">Agentic Document Orchestration System : KKU Library</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button 
                onClick={loadDefaultData} 
                className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition shadow-sm border border-white/20 disabled:opacity-50"
                disabled={isLoading}
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                <span>รีโหลดข้อมูล</span>
              </button>
              <span className="text-[10px] mt-1 text-orange-100 opacity-75">
                {usingCustomData ? 'Custom Data Source' : 'Default Data'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Google Sheet Connect */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Database size={16} className="text-kku-secondary" />
            เชื่อมต่อข้อมูลภายนอก (Google Sheets)
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
             <input 
                type="text" 
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="วางลิงก์ Published CSV ที่นี่ (File > Share > Publish to web > CSV)"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-kku-primary focus:ring focus:ring-kku-primary focus:ring-opacity-50 border p-2 text-sm"
             />
             <button 
                onClick={handleConnectSheet}
                disabled={isLoading || !sheetUrl}
                className="bg-kku-primary hover:bg-red-800 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isLoading ? 'กำลังโหลด...' : 'เชื่อมต่อข้อมูล'}
                {!isLoading && <LinkIcon size={16} />}
             </button>
          </div>
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm">
               <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
               <p>{error}</p>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            * วิธีการ: ใน Google Sheet เลือก <strong>File</strong> &gt; <strong>Share</strong> &gt; <strong>Publish to web</strong> &gt; เลือก <strong>Comma-separated values (.csv)</strong> แล้วคัดลอกลิงก์มาวาง
          </p>
        </div>

        <StatsCards 
          totalDocs={uniqueDocsCount}
          totalPersonnel={uniquePersonnelCount}
          activeDepartments={uniqueDepts.length}
          latestDocDate={latestFormatted}
        />

        <ChartsSection data={filteredData} />

        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          types={uniqueTypes} 
          departments={uniqueDepts} 
        />

        <DocumentTable data={filteredData} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="font-medium text-gray-700">Agentic Document Orchestration System (ADOS)</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Khon Kaen University Library.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;