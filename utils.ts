import { DocumentData, RawCsvRow } from './types';
import * as XLSX from 'xlsx';

// Helper to parse Thai dates like "23/1/2569" or "25 มีนาคม 2568"
export const parseThaiDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  try {
    // Case 1: DD/MM/YYYY (BE)
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        let year = parseInt(parts[2], 10);
        if (year > 2400) year -= 543; // Convert BE to AD
        return new Date(year, month, day);
      }
    }

    // Case 2: DD Month YYYY (BE)
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    // Simple space split, handle cases where day might be missing
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      let day = 1;
      let monthIndex = -1;
      let year = new Date().getFullYear();

      // Find month
      const monthPart = parts.find(p => thaiMonths.some(m => p.includes(m)));
      if (monthPart) {
        monthIndex = thaiMonths.findIndex(m => monthPart.includes(m));
      }

      // Find year (4 digits)
      const yearPart = parts.find(p => /^\d{4}$/.test(p));
      if (yearPart) {
        year = parseInt(yearPart, 10);
        if (year > 2400) year -= 543;
      }

      // Find day (1-2 digits, not the year)
      const dayPart = parts.find(p => /^\d{1,2}$/.test(p) && p !== yearPart);
      if (dayPart) {
        day = parseInt(dayPart, 10);
      }

      if (monthIndex !== -1) {
        return new Date(year, monthIndex, day);
      }
    }
    
    // Attempt standard parse if specific Thai format fails but string looks valid
    const stdDate = new Date(dateStr);
    if (!isNaN(stdDate.getTime())) return stdDate;

  } catch (e) {
    console.error("Error parsing date:", dateStr, e);
  }
  return null;
};

export const transformData = (row: RawCsvRow): DocumentData => {
  return {
    id: row["Document ID"],
    type: row["ประเภทเอกสาร"],
    subject: row["เรื่อง"],
    department: row["หน่วยงาน"],
    receivedDate: parseThaiDate(row["วันที่รับเอกสาร"]),
    receivedDateStr: row["วันที่รับเอกสาร"],
    personnel: row["รายชื่อบุคลากรที่เกี่ยวข้อง"] || "",
    email: row["email"],
    docDate: parseThaiDate(row["วันที่เอกสาร"]),
    docDateStr: row["วันที่เอกสาร"],
    docNumber: row["เลขที่เอกสาร"],
    issuingDepartment: row["หน่วยงานที่เชิญ/ประกาศ"],
    eventDate: row["วันเวลาที่จัดงาน"],
    keyword: row["keyword"],
    url: row["URL"],
  };
};

export const exportToExcel = (data: DocumentData[]) => {
  const ws = XLSX.utils.json_to_sheet(data.map(item => ({
    "ชื่อเอกสาร": item.subject,
    "ประเภท": item.type,
    "เลขที่": item.docNumber,
    "วันที่เอกสาร": item.docDateStr,
    "วันที่รับ": item.receivedDateStr,
    "บุคลากร": item.personnel,
    "หน่วยงาน": item.issuingDepartment,
    "URL": item.url
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Documents");
  XLSX.writeFile(wb, "KKU_Library_Documents.xlsx");
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "-";
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
