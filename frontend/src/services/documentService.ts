import type { ActivityInterface } from "../interfaces/Activity";
import axios from "axios";

const Bearer = localStorage.getItem("token_type");
const apiUrl = "http://localhost:8080/api";
const Authorization = localStorage.getItem("token");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

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

// บันทึกรูปภาพพร้อมรายละเอียด
export async function SaveImageWithDetail(data: {
  file_name: string;
  detail?: string;
  poster: string; // Base64 string
  proposal_activityid: number; // ✅ แก้ชื่อให้ตรงกับ Backend
}) {
  return await axios
    .post(`${apiUrl}/images`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงรูปภาพตาม ID
export async function GetImageById(id: number) {
  return await axios
    .get(`${apiUrl}/images/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ✅ แก้ไข endpoint ให้ตรงกับ Backend
export async function GetImagesByActivityId(activityId: number) {
  return await axios
    .get(`${apiUrl}/activities/${activityId}/images`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตรูปภาพ
export async function UpdateImage(id: number, poster: string) {
  return await axios
    .put(`${apiUrl}/images/${id}`, { poster }, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบรูปภาพ
export async function DeleteImage(id: number) {
  return await axios
    .delete(`${apiUrl}/images/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันช่วยแปลงไฟล์เป็น Base64
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // ✅ ตัด prefix ออก เก็บแค่ Base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ✅ เพิ่ม helper สำหรับแปลง Base64 เป็น Data URL
export function formatBase64ToDataURL(base64: string, mimeType: string = 'image/jpeg'): string {
  if (!base64) return '';
  if (base64.startsWith('data:')) return base64;
  return `data:${mimeType};base64,${base64}`;
}

