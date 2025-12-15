export interface DocumentInterface {
  id?: number;
  file_name?: string;
  file_type?: string;
  file_path?: string;
  upload_date?: string;  // ใน TypeScript ใช้ string สำหรับ date/time
  detail?: string;
  poster?: string;
  
  activity_id?: number;
  
  // ถ้าต้องการ relation กับ Activity (optional)
  activity?: {
    id: number;
    name: string;
    // fields อื่นๆ ของ Activity ที่ต้องการ
  };
  
  // จาก gorm.Model
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}