export interface RawCsvRow {
  "Document ID": string;
  "ประเภทเอกสาร": string;
  "เรื่อง": string;
  "หน่วยงาน": string;
  "วันที่รับเอกสาร": string;
  "รายชื่อบุคลากรที่เกี่ยวข้อง": string;
  "email": string;
  "วันที่เอกสาร": string;
  "เลขที่เอกสาร": string;
  "หน่วยงานที่เชิญ/ประกาศ": string;
  "วันเวลาที่จัดงาน": string;
  "keyword": string;
  "URL": string;
}

export interface DocumentData {
  id: string;
  type: string;
  subject: string;
  department: string;
  receivedDate: Date | null;
  receivedDateStr: string;
  personnel: string;
  email: string;
  docDate: Date | null;
  docDateStr: string;
  docNumber: string;
  issuingDepartment: string;
  eventDate: string;
  keyword: string;
  url: string;
}

export interface FilterState {
  type: string;
  startDate: string;
  endDate: string;
  issuingDept: string;
  searchSubject: string;
  searchPersonnel: string;
}
