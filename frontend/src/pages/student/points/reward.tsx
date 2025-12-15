import  { useState } from 'react';
import { Star, Gift, Lock, Check, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RewardLevelsPage() {
  const [userPoints, setUserPoints] = useState(2341);
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([]);
  const navigate = useNavigate();

  const rewards = {
    premium: [
      { id: 1, name: 'iPad Pro', points: 5000, icon: '📱', image: '', locked: true },
      { id: 2, name: 'AirPods Pro', points: 3500, icon: '🎧', image: '', locked: true },
      { id: 3, name: 'Apple Watch', points: 4000, icon: '⌚', image: '', locked: true },
      { id: 4, name: 'MacBook Air', points: 8000, icon: '💻', image: '', locked: true },
    ],
    medium: [
      { id: 5, name: 'ส่วนลด 500฿', points: 1000, icon: '🎫', image: '', locked: false },
      { id: 6, name: 'กระเป๋าเป้', points: 1500, icon: '🎒', image: '', locked: false },
      { id: 7, name: 'หูฟังไร้สาย', points: 2000, icon: '🎵', image: '', locked: false },
      { id: 8, name: 'Power Bank', points: 800, icon: '🔋', image: '', locked: false },
    ],
    basic: [
      { id: 9, name: 'สติกเกอร์', points: 100, icon: '✨', image: '', locked: false },
      { id: 10, name: 'ปากกา', points: 150, icon: '✏️', image: '', locked: false },
      { id: 11, name: 'แก้วน้ำ', points: 300, icon: '☕', image: '', locked: false },
      { id: 12, name: 'พวงกุญแจ', points: 200, icon: '🔑', image: '', locked: false },
    ]
  };

  const canRedeem = (points: number) => userPoints >= points;
  const isRedeemed = (id: number) => redeemedRewards.includes(id);

  const [confirmReward, setConfirmReward] = useState<typeof rewards.premium[0] | null>(null);

  const handleRedeem = (reward: typeof rewards.premium[0]) => {
    setConfirmReward(reward);
  };

  const handleConfirmRedeem = () => {
    if (confirmReward) {
      setUserPoints(userPoints - confirmReward.points);
      setRedeemedRewards([...redeemedRewards, confirmReward.id]);
      alert(`แลก ${confirmReward.name} สำเร็จ! 🎉`);
      setConfirmReward(null);
    }
  };

  const handleCancelRedeem = () => {
    setConfirmReward(null);
  };

  // เพิ่ม style สำหรับ grid 4 คอลัมน์
  const grid4Col = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginTop: "20px"
  };

  // ปรับ boxStyle ให้ type ถูกต้อง (ใช้ as const)
  const boxStyle = (bg: string, reward: any) => ({
    width: "220px",
    height: "260px",
    backgroundColor: bg,
    borderRadius: "16px",
    marginRight: "20px",
    marginBottom: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    position: "relative" as const,
    cursor: reward.locked || !canRedeem(reward.points) || isRedeemed(reward.id) ? 'not-allowed' : 'pointer',
    opacity: reward.locked || !canRedeem(reward.points) || isRedeemed(reward.id) ? 0.6 : 1,
    border: isRedeemed(reward.id) ? '3px solid #10b981' : 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    alignItems: "center" as const,
  });

  const sectionStyle = {
    marginTop: "40px",
    width: "100%",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const pointsHeader = {
    backgroundColor: "#f8f9fa",
    padding: "20px 30px",
    borderRadius: "16px",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "2px solid #e9ecef",
  };

  return (
    <div style={{
      width: "90%",
      maxWidth: "1400px",
      minHeight: "100vh",
      padding: "30px 0",
      margin: "0 auto"
    }}>
      {/* ปุ่มกลับไปหน้าคะแนน */}
      <button
        style={{
          marginBottom: "24px",
          background: "#F472B6",
          color: "white",
          padding: "12px 32px",
          fontSize: "16px",
          fontWeight: "600",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
        onClick={() => navigate("/student/points")}
      >
        ← กลับไปหน้าคะแนน
      </button>

      {/* Header แสดงคะแนน */}
      <div style={pointsHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Star size={32} color="#fbbf24" fill="#fbbf24" />
          <div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>คะแนนของคุณ</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937" }}>{userPoints.toLocaleString()}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>รางวัลที่แลกแล้ว</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{redeemedRewards.length}</div>
        </div>
      </div>

      {/* ระดับบน (ฟ้า) - Premium */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          <Trophy size={28} color="#3b82f6" />
          <span>ของรางวัลระดับพรีเมียม</span>
          <Lock size={20} color="#ef4444" style={{ marginLeft: "8px" }} />
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
          🔒 ต้องสะสมคะแนนสูงกว่า 3,000 คะแนนถึงจะปลดล็อค
        </div>
        <div style={grid4Col}>
          {rewards.premium.map((reward) => (
            <div 
              key={reward.id} 
              style={boxStyle("#DFEAFE", reward)}
              onClick={() => handleRedeem(reward)}
            >
              {isRedeemed(reward.id) && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  padding: '6px',
                }}>
                  <Check size={20} color="white" />
                </div>
              )}
              {reward.locked && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  padding: '6px',
                }}>
                  <Lock size={16} color="white" />
                </div>
              )}
              <div style={{ fontSize: "60px", textAlign: "center" }}>{reward.icon}</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
                  {reward.name}
                </div>
                <div style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold", 
                  color: "#3b82f6",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px"
                }}>
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  {reward.points.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ระดับกลาง (เหลือง) */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          <Zap size={28} color="#eab308" />
          <span>ของรางวัลระดับกลาง</span>
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
          ⭐ รางวัลคุณภาพดีสำหรับผู้ที่สะสมคะแนนได้เยอะ
        </div>
        <div style={grid4Col}>
          {rewards.medium.map((reward) => (
            <div 
              key={reward.id} 
              style={boxStyle("#FEF6DF", reward)}
              onClick={() => handleRedeem(reward)}
            >
              {isRedeemed(reward.id) && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  padding: '6px',
                }}>
                  <Check size={20} color="white" />
                </div>
              )}
              <div style={{ fontSize: "60px", textAlign: "center" }}>{reward.icon}</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
                  {reward.name}
                </div>
                <div style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold", 
                  color: "#eab308",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px"
                }}>
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  {reward.points.toLocaleString()}
                </div>
                {!canRedeem(reward.points) && !isRedeemed(reward.id) && (
                  <div style={{ fontSize: "12px", color: "#ef4444", textAlign: "center", marginTop: "4px" }}>
                    ต้องการอีก {(reward.points - userPoints).toLocaleString()} คะแนน
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ระดับล่าง (ชมพู) */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          <Gift size={28} color="#ec4899" />
          <span>ของรางวัลระดับเริ่มต้น</span>
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
          🎁 รางวัลน่ารักๆ สำหรับทุกคน แลกได้ง่าย!
        </div>
        <div style={grid4Col}>
          {rewards.basic.map((reward) => (
            <div 
              key={reward.id} 
              style={boxStyle("#FFD6E8", reward)}
              onClick={() => handleRedeem(reward)}
            >
              {isRedeemed(reward.id) && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  padding: '6px',
                }}>
                  <Check size={20} color="white" />
                </div>
              )}
              <div style={{ fontSize: "60px", textAlign: "center" }}>{reward.icon}</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
                  {reward.name}
                </div>
                <div style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold", 
                  color: "#ec4899",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px"
                }}>
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  {reward.points.toLocaleString()}
                </div>
                {!canRedeem(reward.points) && !isRedeemed(reward.id) && (
                  <div style={{ fontSize: "12px", color: "#ef4444", textAlign: "center", marginTop: "4px" }}>
                    ต้องการอีก {(reward.points - userPoints).toLocaleString()} คะแนน
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* คำแนะนำ */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#f3f4f6",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#4b5563"
      }}>
        <strong>💡 วิธีการแลกรางวัล:</strong>
        <ul style={{ marginTop: "10px", marginLeft: "20px" }}>
          <li>คลิกที่รางวัลที่ต้องการแลก (ต้องมีคะแนนเพียงพอ)</li>
          <li>รางวัลที่แลกแล้วจะมีเครื่องหมาย ✓ สีเขียว</li>
          <li>รางวัลพรีเมียมจะปลดล็อคเมื่อสะสมคะแนนได้มากกว่า 3,000 คะแนน</li>
        </ul>
      </div>

      {/* Modal ยืนยันการแลก */}
      {confirmReward && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.25)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, minWidth: 320, boxShadow: "0 4px 24px #0002", textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>ยืนยันการแลกรางวัล</div>
            <div style={{ fontSize: 16, marginBottom: 18 }}>คุณต้องการแลก <span style={{ fontWeight: 600 }}>{confirmReward.name}</span> ใช้ <span style={{ color: '#fbbf24', fontWeight: 700 }}>{confirmReward.points.toLocaleString()}</span> คะแนน?</div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
              <button onClick={handleConfirmRedeem} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>ยืนยัน</button>
              <button onClick={handleCancelRedeem} style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
