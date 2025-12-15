import type {  CreatePostRequest, UpdatePostRequest  } from "../interfaces/post";
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
export async function CreatePost(data: CreatePostRequest) {
    console.log("Creating post with payload:", data);
    return await axios
        .post(`${apiUrl}/post`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => {
            console.error("Create post error:", e.response?.data);
            return e.response;
        });
}

// // ดึงผลงานตาม ID (สำหรับหน้า Detail)
// export async function GetPostById(id: number) {
//     return await axios
//         .get(`${apiUrl}/post/${id}`, getRequestOptions())
//         .then((res) => res)
//         .catch((e) => e.response);
// }

// // ดึงผลงานทั้งหมดของ User (สำหรับหน้า List ของนักศึกษา)
// export async function GetPostByUserId(userId: number) {
//     return await axios
//         .get(`${apiUrl}/users/${userId}/post`, getRequestOptions())
//         .then((res) => res)
//         .catch((e) => e.response);
// }

export async function GetPost() {
    return await axios
        .get(`${apiUrl}/post/my`, getRequestOptions()) // สมมติว่ามี route นี้
        .then((res) => res)
        .catch((e) => e.response);
}


export async function UpdatePost(id: number, data: UpdatePostRequest) {
    return await axios
        .put(`${apiUrl}/post/${id}`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
        
}

export async function DeletePost(id: number) {
    return await axios
        .delete(`${apiUrl}/post/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

// ----------------------------------------------------
// Dropdown Data
// ----------------------------------------------------

// ดึงสถานะผลงาน (Pending, Approved, Rejected)
// export async function GetPortfolioStatuses() {
//     return await axios
//         .get(`${apiUrl}/post`, getRequestOptions())
//         .then((res) => res)
//         .catch((e) => e.response);
// }

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

// ----------------------------------------------------
// Proposal Activities (Dropdown สำหรับ Select)
// ----------------------------------------------------
export async function GetProposalActivities() {
    return await axios
        .get(`${apiUrl}/proposal_activities`, getRequestOptions()) // สมมติ backend route นี้
        .then((res) => res)
        .catch((e) => {
            console.error("GetProposalActivities error:", e.response?.data);
            return e.response;
        });
}


