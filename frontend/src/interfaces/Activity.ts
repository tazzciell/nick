// interfaces/Activity.ts

export interface ActivityInterface {  // ← เพิ่ม export ข้างหน้า
  id?: number;
  name?: string;
  detail?: string;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  type?: string;
  objective?: string;
  status?: string;
  location_id?: number;
  
  location?: {
    id: number;
    name: string;
  };
  
  created_by?: string;
  views?: number;
  comments?: number;
  created_at?: string;
  updated_at?: string;
}