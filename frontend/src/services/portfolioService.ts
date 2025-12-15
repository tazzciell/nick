import type { PortfolioInterface } from "../interfaces/portfolio";
import axios from "axios";

// ✅ ตรวจสอบ URL ให้ตรงกับ Backend (ใช้ /api ตาม Log ที่คุณส่งมาก่อนหน้า)
const apiUrl = "http://localhost:8080/api";

// ✅ สร้าง function สำหรับดึง headers แบบ dynamic (ดึง Token ใหม่ทุกครั้งที่เรียก)
const getRequestOptions = () => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${tokenType} ${token}`,
    },
  };
};

// ----------------------------------------------------
// Portfolio CRUD
// ----------------------------------------------------

// สร้างผลงานใหม่
export async function CreatePortfolio(data: PortfolioInterface) {
  console.log("Creating portfolio with payload:", data); // ✅ Debug Payload
  return await axios
    .post(`${apiUrl}/portfolios`, data, getRequestOptions())
    .then((res) => res)
    .catch((e) => {
      console.error("Create portfolio error:", e.response?.data); // ✅ Debug Error response
      return e.response;
    });
}

// ดึงผลงานตาม ID (สำหรับหน้า Detail)
export async function GetPortfolioById(id: number) {
  return await axios
    .get(`${apiUrl}/portfolios/${id}`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงผลงานทั้งหมดของ User (สำหรับหน้า List ของนักศึกษา)
export async function GetPortfoliosByUserId(userId: number) {
  return await axios
    .get(`${apiUrl}/users/${userId}/portfolios`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงผลงานของฉัน (ถ้า Backend มี Route นี้ที่ดึงจาก Token)
export async function GetMyPortfolios() {
    return await axios
      .get(`${apiUrl}/portfolios/my`, getRequestOptions()) // สมมติว่ามี route นี้
      .then((res) => res)
      .catch((e) => e.response);
  }

// แก้ไขผลงาน
export async function UpdatePortfolio(id: number, data: PortfolioInterface) {
  return await axios
    .patch(`${apiUrl}/portfolios/${id}`, data, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบผลงาน
export async function DeletePortfolio(id: number) {
  return await axios
    .delete(`${apiUrl}/portfolios/${id}`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// ----------------------------------------------------
// Dropdown Data
// ----------------------------------------------------

// ดึงสถานะผลงาน (Pending, Approved, Rejected)
export async function GetPortfolioStatuses() {
  return await axios
    .get(`${apiUrl}/portfolio-statuses`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------

// ฟังก์ชันช่วยแปลงไฟล์เป็น Base64 (ตัด prefix ออก ส่งเฉพาะ data)
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // ตัด data:image/png;base64, ออก เอาแค่ตัวเนื้อ Base64
      // เพื่อให้ Backend (Go) รับไป decode ได้ง่ายขึ้น
      const base64 = result.split(',')[1]; 
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Helper สำหรับแปลง Base64 เป็น Data URL เพื่อแสดงผลใน <img> ฝั่ง Frontend
export function formatBase64ToDataURL(base64: string | undefined, mimeType: string = 'image/jpeg'): string {
  if (!base64) return '';
  if (base64.startsWith('data:')) return base64;
  return `data:${mimeType};base64,${base64}`;
}