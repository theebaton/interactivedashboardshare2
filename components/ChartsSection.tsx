import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DocumentData } from '../types';

interface ChartsProps {
  data: DocumentData[];
}

const COLORS = ['#A73B24', '#F3A712', '#682312', '#D97706', '#92400E', '#B45309', '#F59E0B', '#78350F'];

const ChartsSection: React.FC<ChartsProps> = ({ data }) => {
  // Process data for Personnel Chart (Top 10)
  const personnelCount: Record<string, number> = {};
  data.forEach(item => {
    if (item.personnel) {
      personnelCount[item.personnel] = (personnelCount[item.personnel] || 0) + 1;
    }
  });

  const personnelData = Object.entries(personnelCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Process data for Document Type Distribution
  const typeCount: Record<string, number> = {};
  data.forEach(item => {
    if (item.type) {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    }
  });

  const typeData = Object.entries(typeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Process data for Monthly Trend (Current Year or All Time if mostly one year)
  // Extracting years from data to see typical range
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const monthlyTrend: Record<string, number> = {};
  
  data.forEach(item => {
    if (item.docDate) {
      // Use BE Year for display grouping if needed, but let's stick to Month aggregation across dataset for demo
      const monthIndex = item.docDate.getMonth();
      const key = months[monthIndex];
      monthlyTrend[key] = (monthlyTrend[key] || 0) + 1;
    }
  });

  const trendData = months.map(m => ({ name: m, docs: monthlyTrend[m] || 0 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 font-sans">
      {/* Personnel Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-kku-primary">
        <h3 className="text-xl font-bold text-gray-800 mb-6 font-display">บุคลากรที่มีส่วนร่วมในเอกสารสูงสุด (Top 10)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={personnelData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#fef2f2'}} />
              <Bar dataKey="count" fill="#A73B24" name="จำนวนเอกสาร" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Type Pie Chart & Monthly Trend */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-kku-secondary">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-display">สัดส่วนประเภทเอกสาร</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gray-600">
           <h3 className="text-xl font-bold text-gray-800 mb-4 font-display">แนวโน้มจำนวนเอกสารรายเดือน</h3>
           <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="docs" fill="#682312" name="จำนวน" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;