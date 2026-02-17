import React from 'react';
import { FileText, Users, Building, Calendar } from 'lucide-react';

interface StatsProps {
  totalDocs: number;
  totalPersonnel: number;
  activeDepartments: number;
  latestDocDate: string;
}

const StatsCards: React.FC<StatsProps> = ({ totalDocs, totalPersonnel, activeDepartments, latestDocDate }) => {
  const cards = [
    {
      title: "เอกสารที่ประมวลผลแล้ว",
      value: totalDocs,
      subtitle: "Processed Documents",
      icon: <FileText className="h-8 w-8 text-white opacity-80" />,
      color: "bg-kku-primary"
    },
    {
      title: "บุคลากรที่เกี่ยวข้อง",
      value: totalPersonnel,
      subtitle: "Personnel Involved",
      icon: <Users className="h-8 w-8 text-white opacity-80" />,
      color: "bg-kku-secondary"
    },
    {
      title: "หน่วยงานที่เกี่ยวข้อง",
      value: activeDepartments,
      subtitle: "Active Departments",
      icon: <Building className="h-8 w-8 text-white opacity-80" />,
      color: "bg-gray-700"
    },
    {
      title: "เอกสารล่าสุด",
      value: latestDocDate,
      subtitle: "Latest Document",
      icon: <Calendar className="h-8 w-8 text-white opacity-80" />,
      color: "bg-orange-800"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-display">
      {cards.map((card, index) => (
        <div key={index} className={`${card.color} rounded-xl shadow-lg p-6 text-white transform transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value}</h3>
              <p className="text-xs opacity-75 mt-1">{card.subtitle}</p>
            </div>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;