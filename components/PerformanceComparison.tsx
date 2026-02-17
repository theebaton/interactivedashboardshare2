import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceComparison: React.FC = () => {
  // Data from Table 1: Lead Time Reduction
  const timeData = [
    {
      name: 'หนังสือเชิญ (นาที)',
      Traditional: 30,
      ADOS: 1,
      Reduction: '96.67%'
    },
    {
      name: 'ประกาศ/คำสั่ง (นาที)',
      Traditional: 30,
      ADOS: 1,
      Reduction: '96.67%'
    },
    {
      name: 'การตอบสนอง (นาที)', // Normalized to minutes for scale visibility or separate axis, keeping conceptual
      Traditional: 1440, // 1 Day
      ADOS: 30,
      Reduction: '97.92%'
    }
  ];

  // Data from Table 2: Cost Comparison
  const costData = [
    {
      name: 'ต้นทุนแรงงาน (บาท/ฉบับ)',
      Traditional: 91.5,
      ADOS: 3.4,
      Reduction: '96.3%'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 font-sans">
      
      {/* Lead Time Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-display">ประสิทธิผลด้านความรวดเร็ว (Lead Time)</h3>
            <p className="text-sm text-gray-500">เปรียบเทียบระยะเวลาการดำเนินงาน (Traditional vs ADOS)</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeData.slice(0, 2)} // Showing first two mainly for scale
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'เวลา (นาที)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value} นาที`} />
              <Legend />
              <Bar dataKey="Traditional" fill="#9CA3AF" name="แบบดั้งเดิม (Baseline)" />
              <Bar dataKey="ADOS" fill="#2563EB" name="ระบบ ADOS (AI)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
            <strong>ผลลัพธ์:</strong> ลดระยะเวลาได้มากกว่า 96% ในทุกประเภทเอกสาร
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
         <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-display">การลดต้นทุนแรงงาน (Labor Cost)</h3>
            <p className="text-sm text-gray-500">เปรียบเทียบต้นทุนต่อเอกสาร 1 ฉบับ</p>
        </div>
        <div className="h-64 w-full flex flex-col justify-center">
             <div className="grid grid-cols-2 gap-8 text-center items-end h-full pb-8">
                <div className="flex flex-col items-center group">
                    <div className="text-gray-500 mb-2 font-medium">แบบดั้งเดิม</div>
                    <div className="w-24 bg-gray-400 rounded-t-lg transition-all duration-500 group-hover:bg-gray-500 relative" style={{height: '180px'}}>
                        <span className="absolute -top-6 left-0 right-0 font-bold text-gray-700">91.5 ฿</span>
                    </div>
                </div>
                <div className="flex flex-col items-center group">
                    <div className="text-green-700 mb-2 font-medium">ระบบ ADOS</div>
                    <div className="w-24 bg-green-500 rounded-t-lg transition-all duration-500 group-hover:bg-green-600 relative" style={{height: '20px'}}>
                         <span className="absolute -top-6 left-0 right-0 font-bold text-green-700">3.4 ฿</span>
                    </div>
                </div>
             </div>
        </div>
         <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            <strong>ผลลัพธ์:</strong> ลดต้นทุนแรงงานต่อฉบับลง 96.3% (ประหยัด ~88 บาท/ฉบับ)
        </div>
      </div>

    </div>
  );
};

export default PerformanceComparison;