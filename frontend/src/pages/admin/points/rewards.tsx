import React, { useState } from "react";

interface Reward {
  id: number;
  name: string;
  points: number;
  img: string;
  level: string;
  stock: number;
  desc?: string;
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: "น้ำดื่มคริสตัล", points: 100, img: "https://cdn-icons-png.flaticon.com/512/747/747376.png", level: "basic", stock: 0 },
    { id: 2, name: "น้ำดื่มคริสตัล", points: 100, img: "https://cdn-icons-png.flaticon.com/512/747/747376.png", level: "basic", stock: 5 },
    { id: 3, name: "น้ำดื่มคริสตัล", points: 100, img: "https://cdn-icons-png.flaticon.com/512/747/747376.png", level: "basic", stock: 15 },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    reward_name: "",
    point_required: 0,
    stock: 0,
    description: "",
    image: undefined as File | undefined,
    imageUrl: ""
  });

  // สรุปสเตตัส
  const total = rewards.length;
  const high = rewards.filter(r => r.stock > 10).length;
  const low = rewards.filter(r => r.stock > 0 && r.stock <= 10).length;
  const out = rewards.filter(r => r.stock === 0).length;

  // สีการ์ด pastel/modern
  const getCardBg = (stock: number) => {
    if (stock === 0) return "#FFD8E4"; // หมดแล้ว (ชมพูอ่อน)
    if (stock <= 10) return "#FDF5DE"; // ใกล้หมด (ม่วงอ่อน)
    return "#E1ECFE"; // คงเหลือสูง (ฟ้าอ่อน)
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    setRewards([
      ...rewards,
      {
        id: Date.now(),
        name: form.reward_name,
        points: form.point_required,
        img: form.imageUrl || "https://cdn-icons-png.flaticon.com/512/747/747376.png",
        level: "basic",
        stock: form.stock,
        desc: form.description
      }
    ]);
    setShowAdd(false);
    setForm({ reward_name: "", point_required: 0, stock: 0, description: "", image: undefined, imageUrl: "" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff)", padding: "40px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* สรุปสเตตัส */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1, background: "#a5b4fc", color: "#000", borderRadius: 16, padding: 24, textAlign: "center", fontWeight: 500, fontSize: 24, boxShadow: "0 2px 8px #a5b4fc33" }}> {total} <div style={{ fontSize: 15, fontWeight: 500 }}>ทั้งหมดมี</div></div>
          <div style={{ flex: 1, background: "#E1ECFE", color: "#000", borderRadius: 16, padding: 24, textAlign: "center", fontWeight: 500, fontSize: 24, boxShadow: "0 2px 8px #E1ECFE" }}> {high} <div style={{ fontSize: 15, fontWeight: 500 }}>คงเหลือสูง</div></div>
          <div style={{ flex: 1, background: "#FDF5DE", color: "#000", borderRadius: 16, padding: 24, textAlign: "center", fontWeight: 500, fontSize: 24, boxShadow: "0 2px 8px #FDF5DE" }}> {low} <div style={{ fontSize: 15, fontWeight: 500 }}>ใกล้หมด</div></div>
          <div style={{ flex: 1, background: "#FFD8E4", color: "#000", borderRadius: 16, padding: 24, textAlign: "center", fontWeight: 500, fontSize: 24, boxShadow: "0 2px 8px #FFD8E4" }}> {out} <div style={{ fontSize: 15, fontWeight: 500 }}>หมดแล้ว</div></div>
        </div>
        {/* รายการสินค้า/รางวัล */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontWeight: 500, fontSize: 20 }}>รายการสินค้า</div>
          <button onClick={() => setShowAdd(true)} style={{ background: "#a5b4fc", color: "#3730a3", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 500, fontSize: 15, cursor: "pointer", boxShadow: "0 2px 8px #a5b4fc33" }}>+ เพิ่มของรางวัล</button>
        </div>
        {/* Modal ฟอร์มเพิ่มของรางวัล */}
        {showAdd && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.2)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px #0002", padding: 32, minWidth: 340, maxWidth: 400, width: "100%", position: "relative" }}>
              <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 18, textAlign: "center" }}>เพิ่มของรางวัล</h2>
              <form onSubmit={handleAddReward}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>ชื่อของรางวัล</label>
                  <input type="text" required value={form.reward_name} onChange={e => setForm(f => ({ ...f, reward_name: e.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>คะแนนที่ต้องใช้ในการแลก</label>
                  <input type="number" required min={1} value={form.point_required} onChange={e => setForm(f => ({ ...f, point_required: Number(e.target.value) }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>จำนวนของรางวัล</label>
                  <input type="number" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>รายละเอียดเพิ่มเติม</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>อัปโหลดรูปภาพ</label>
                  <div
                    style={{
                      border: '2px dashed #a5b4fc',
                      borderRadius: 10,
                      padding: '18px 0',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      marginBottom: 8
                    }}
                    onClick={() => document.getElementById('reward-image-upload')?.click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setForm(f => ({ ...f, image: file, imageUrl: URL.createObjectURL(file) }));
                      }
                    }}
                  >
                    <div style={{ color: '#a5b4fc', fontWeight: 600, fontSize: 15 }}>ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกไฟล์</div>
                    <input
                      id="reward-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm(f => ({ ...f, image: file, imageUrl: URL.createObjectURL(file) }));
                        }
                      }}
                    />
                  </div>
                  {form.imageUrl && (
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                      <img src={form.imageUrl} alt="preview" style={{ maxWidth: 120, borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>ยกเลิก</button>
                  <button type="submit" style={{ background: "#a5b4fc", color: "#3730a3", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>บันทึก</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32,width: '100%' }}>
          {rewards.map(r => (
            <div key={r.id} style={{ background: getCardBg(r.stock), borderRadius: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <img src={r.img} alt={r.name} style={{ width: 100, height: 100, objectFit: "contain", marginBottom: 16, borderRadius: 12, boxShadow: "0 2px 8px #0001" }} />
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8, color: "#3730a3" }}>{r.name}</div>
              <div style={{ color: "#f472b6", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>⭐ {r.points.toLocaleString()}</div>
              <div style={{ fontSize: 15, marginBottom: 10, color: r.stock === 0 ? "#f43f5e" : r.stock <= 10 ? "#a21caf" : "#0369a1" }}>
                จำนวนคงเหลือ: {r.stock === 0 ? "0" : r.stock > 10 ? r.stock : r.stock <= 10 ? r.stock : ""}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ background: "#a5b4fc", color: "#3730a3", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 15, cursor: r.stock === 0 ? "not-allowed" : "pointer", opacity: r.stock === 0 ? 0.5 : 1, boxShadow: "0 2px 8px #a5b4fc33" }}>แก้ไข</button>
                <button style={{ background: "#fca5a5", color: "#991b1b", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 2px 8px #fca5a533" }}>ลบ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}