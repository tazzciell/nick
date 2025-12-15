import type { ActivityInterface } from "../interfaces/Activity";
import axios from "axios";

const apiUrl = "http://localhost:8080/api";

// ✅ สร้าง function สำหรับดึง headers แบบ dynamic
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

// Activities
export async function CreateActivity(data: ActivityInterface) {
  console.log("Creating activity with token:", localStorage.getItem("token")); // ✅ Debug
  return await axios
    .post(`${apiUrl}/proposal_activities`, data, getRequestOptions())
    .then((res) => res)
    .catch((e) => {
      console.error("Create activity error:", e.response?.data); // ✅ Debug
      return e.response;
    });
}

export async function GetActivities() {
  return await axios
    .get(`${apiUrl}/proposal_activities`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetActivityById(id: string) {
  return await axios
    .get(`${apiUrl}/proposal_activities/${id}`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function UpdateActivity(id: string, data: ActivityInterface) {
  return await axios
    .put(`${apiUrl}/proposal_activities/${id}`, data, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function DeleteActivity(id: string) {
  return await axios
    .delete(`${apiUrl}/proposal_activities/${id}`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// Registration
export async function RegisterActivity(activityId: string, data: any) {
  return await axios
    .post(`${apiUrl}/proposal_activities/${activityId}/register`, data, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function CancelRegistration(activityId: string) {
  return await axios
    .delete(`${apiUrl}/proposal_activities/${activityId}/register`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetRegistrationStatus(activityId: string) {
  return await axios
    .get(`${apiUrl}/proposal_activities/${activityId}/registration`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetMyRegistrations() {
  return await axios
    .get(`${apiUrl}/proposal_activities/my-registrations`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

// Locations
export async function GetLocations() {
  return await axios
    .get(`${apiUrl}/location/`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetLocationById(id: number) {
  return await axios
    .get(`${apiUrl}/location/${id}`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetMyActivities() {
  return await axios
    .get(`${apiUrl}/proposal_activities/my`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}

export async function UpdateActivityStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
  reason?: string
) {
  return await axios
    .put(
      `${apiUrl}/proposal_activities/${id}/status`,
      { status, reason },
      getRequestOptions()
    )
    .then((res) => res)
    .catch((e) => e.response);
}

export async function GetActivityStatus(id: string) {
  return await axios
    .get(`${apiUrl}/proposal_activities/${id}/status`, getRequestOptions())
    .then((res) => res)
    .catch((e) => e.response);
}