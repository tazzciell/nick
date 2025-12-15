import React, { useState } from "react";

export default function AdminPointsPage() {
  // mock กิจกรรมและคะแนน
  const [activities, setActivities] = useState([
    { id: 1, name: "เข้าร่วมอบรม Coding", points: 150 },
    { id: 2, name: "ทำแบบทดสอบ", points: 100 },
    { id: 3, name: "เช็คอินประจำวัน", points: 20 },
    { id: 4, name: "แชร์กิจกรรม", points: 50 },
  ]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPoints, setEditPoints] = useState(0);

  const handleEdit = (id: number, points: number) => {
    setEditId(id);
    setEditPoints(points);
  };
  const handleSave = (id: number) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, points: editPoints } : a))
    );
    setEditId(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "40px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#22223b",
            }}
          >
            ระบบคะแนนกิจกรรม
          </h1>
          <input
            type="text"
            placeholder="ค้นหานักศึกษา/กิจกรรม..."
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid #d1d5db",
              fontSize: 16,
              width: 260,
            }}
          />
        </div>
        {/* Cards section */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              padding: 24,
              minWidth: 260,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              กิจกรรมล่าสุด
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 16,
              }}
            >
              เข้าร่วม: ค่ายพัฒนาทักษะ Coding
            </div>
            <div
              style={{
                height: 8,
                background: "#f3f4f6",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: 8,
                  background: "#60a5fa",
                  borderRadius: 8,
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              70% ของนักศึกษาร่วมกิจกรรมนี้
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              padding: 24,
              minWidth: 260,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              รางวัลยอดนิยม
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 16,
              }}
            >
              AirPods Pro
            </div>
            <div
              style={{
                height: 8,
                background: "#f3f4f6",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: "40%",
                  height: 8,
                  background: "#f472b6",
                  borderRadius: 8,
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              40% ของนักศึกษาแลก
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              padding: 24,
              minWidth: 260,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              คะแนนรวม
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#f59e42",
                marginBottom: 8,
              }}
            >
              12,340
            </div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              คะแนนสะสมทั้งหมดในระบบ
            </div>
          </div>
          {/* การ์ดจัดการของรางวัล */}
          <div
            style={{
              flex: 1,
              background: "#f9fafb",
              borderRadius: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              padding: 24,
              minWidth: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px dashed #f472b6",
            }}
            onClick={() => (window.location.href = "/admin/points/rewards")}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#f472b6",
                marginBottom: 10,
              }}
            >
              จัดการของรางวัล
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 12,
              }}
            >
              เพิ่ม/แก้ไข/ลบรางวัล
            </div>
            <div style={{ fontSize: 32, color: "#f472b6" }}>🎁</div>
          </div>
        </div>
        {/* Section: ตั้งค่าคะแนนกิจกรรม */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            padding: 24,
            marginBottom: 32,
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 18,
            }}
          >
            ตั้งค่าคะแนนกิจกรรม
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th
                  style={{
                    padding: "10px 8px",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  กิจกรรม
                </th>
                <th
                  style={{
                    padding: "10px 8px",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  คะแนน
                </th>
                <th
                  style={{
                    padding: "10px 8px",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                    textAlign: "left",
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: "10px 8px" }}>{a.name}</td>
                  <td style={{ padding: "10px 8px", minWidth: 180 }}>
                    {editId === a.id ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="number"
                          value={editPoints}
                          min={0}
                          onChange={(e) =>
                            setEditPoints(Number(e.target.value))
                          }
                          style={{
                            width: 80,
                            padding: 6,
                            borderRadius: 6,
                            border: "1px solid #ddd",
                          }}
                        />
                        <button
                          onClick={() => handleSave(a.id)}
                          style={{
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          บันทึก
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          style={{
                            background: "#e5e7eb",
                            color: "#374151",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      a.points
                    )}
                  </td>
                  <td style={{ padding: "10px 8px", minWidth: 90 }}>
                    {editId !== a.id && (
                      <button
                        onClick={() => handleEdit(a.id, a.points)}
                        style={{
                          background: "#f59e42",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 16px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        แก้ไข
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
