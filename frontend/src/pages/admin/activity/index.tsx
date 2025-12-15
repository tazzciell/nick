// src/pages/admin/ManageActivities.tsx
import React, { useEffect, useState } from "react";
import { GetActivities, UpdateActivityStatus } from "@/services/activityService";
import { Button } from "@/components/ui/button";

function ManageActivities() {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    const res = await GetActivities();
    if (res.status === 200) {
      // Filter เฉพาะที่เป็น pending
      const pending = res.data.filter((act: any) => act.status === "pending");
      setPendingActivities(pending);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("ยืนยันการอนุมัติกิจกรรมนี้?")) return;
    
    setLoading(true);
    const res = await UpdateActivityStatus(id, "approved");
    
    if (res.status === 200) {
      alert("✅ อนุมัติสำเร็จ!");
      fetchPendingActivities(); // Refresh
    } else {
      alert("❌ เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    const reason = prompt("เหตุผลในการปฏิเสธ:");
    if (!reason) return;

    setLoading(true);
    const res = await UpdateActivityStatus(id, "rejected", reason);
    
    if (res.status === 200) {
      alert("✅ ปฏิเสธสำเร็จ!");
      fetchPendingActivities();
    } else {
      alert("❌ เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">จัดการกิจกรรมที่รออนุมัติ</h1>
      
      {pendingActivities.length === 0 ? (
        <p className="text-slate-500">ไม่มีกิจกรรมรออนุมัติ</p>
      ) : (
        <div className="space-y-4">
          {pendingActivities.map((activity: any) => (
            <div key={activity.ID} className="border rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-lg">{activity.name}</h3>
              <p className="text-sm text-slate-600">โดย: {activity.User?.name || "ไม่ระบุ"}</p>
              <p className="text-sm text-slate-600 mt-2">{activity.detail}</p>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleApprove(activity.ID.toString())}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ อนุมัติ
                </Button>
                
                <Button
                  onClick={() => handleReject(activity.ID.toString())}
                  disabled={loading}
                  variant="destructive"
                >
                  ❌ ปฏิเสธ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageActivities;