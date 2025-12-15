import { useState } from "react";
import { Star, Gift, Award, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function StudentPointsPage() {
  const [points, setPoints] = useState(2341);
  const [activities, setActivities] = useState([
    { id: 1, name: "เข้าร่วมอบรมออนไลน์", points: 150, date: "7 ธ.ค. 2567", type: "workshop" },
    { id: 2, name: "ทำแบบทดสอบผ่าน", points: 100, date: "6 ธ.ค. 2567", type: "quiz" },
    { id: 3, name: "เช็คอินประจำวัน", points: 20, date: "6 ธ.ค. 2567", type: "checkin" },
    { id: 4, name: "แชร์กิจกรรม", points: 50, date: "5 ธ.ค. 2567", type: "social" },
  ]);
  const [checkinDates, setCheckinDates] = useState<Date[]>([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const nextLevelPoints = 12;
  const currentLevel = "ทองงง";
  const progressPoints = 123;

  const navigate = useNavigate();

  // ฟังก์ชันรับคะแนนรายวัน (mock)
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const hasCheckedInToday = checkinDates.some(d => d.getTime() === todayDate.getTime());

  const handleDailyCheckin = () => {
    if (hasCheckedInToday) return;
    setPoints(points + 20);
    setActivities([
      { id: Date.now(), name: "เช็คอินวันนี้", points: 20, date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }), type: "checkin" },
      ...activities,
    ]);
    setCheckinDates([...checkinDates, new Date(todayDate)]);
    setShowCalendarPopup(true);
    // alert("รับคะแนนเช็คอินวันนี้สำเร็จ!");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workshop": return "📚";
      case "quiz": return "✅";
      case "checkin": return "⭐";
      case "social": return "📱";
      default: return "🎯";
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f9f9f9", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* 🔵 พื้นหลังฟ้า */}
      <div
        style={{
          width: "100%",
          height: "140px",
          background: "#BFDBFE",
          position: "relative",
          display: "flex",
          justifyContent: "center"
        }}
      >

        {/* การ์ดคะแนนลอย */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            transform: "translateY(50%)",
            width: "90%",
            maxWidth: "900px",
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Star size={40} color="#FACC15" fill="#FACC15" />

            <div style={{ fontSize: "20px", fontWeight: "600" }}>คะแนนของฉัน</div>

            <div style={{ marginLeft: "auto", fontSize: "40px", fontWeight: "700" }}>
              {points}
            </div>

            <div style={{ color: "#6b7280" }}>คะแนน</div>
          </div>

          <div style={{ marginTop: "4px", marginLeft: "56px", fontSize: "13px", color: "#9ca3af" }}>
            อีก {nextLevelPoints} คะแนนเพื่อระดับถัดไป
          </div>
        </div>
      </div>

      {/* กันพื้นที่ */}
      <div style={{ height: "90px" }}></div>

      {/* ปุ่ม */}
      <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          style={{
            background: hasCheckedInToday ? "#d1d5db" : "#F9A8D4",
            color: hasCheckedInToday ? "#6b7280" : "white",
            minWidth: "180px",
            padding: "20px 32px",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "14px",
            border: "none",
            cursor: hasCheckedInToday ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onClick={handleDailyCheckin}
          disabled={hasCheckedInToday}
        >
          <Calendar size={20} /> {hasCheckedInToday ? "รับคะแนนแล้ววันนี้" : "รับคะแนนรายวัน"}
        </button>

        <button
          style={{
            background: "#F472B6",
            color: "white",
            minWidth: "180px",
            padding: "20px 32px",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onClick={() => navigate("/student/points/reward")}
        >
          <Gift size={20} /> แลกรางวัล
        </button>
      </div>

      {/* การ์ดระดับ */}
      <div
        style={{
          marginTop: "24px",
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Award size={20} color="#FACC15" />
          <div style={{ fontWeight: "ถ00" }}>ระดับ {currentLevel}</div>
          <div style={{ marginLeft: "4px", color: "#6b7280" }}>
            อีก {progressPoints} แต้มถึบบ
          </div>
        </div>

        {/* Progress */}
        <div style={{ width: "100%", height: "10px", background: "#E5E7EB", borderRadius: "20px" }}>
          <div
            style={{
              width: "60%",
              height: "10px",
              borderRadius: "20px",
              background: "linear-gradient(to right, #FACC15, #F472B6)"
            }}
          ></div>
        </div>
      </div>

      {/* ตัวอย่างการ์ดรางวัล */}
      <div style={{ width: "100%", maxWidth: "900px", margin: "32px auto 0 auto" }}>
        <div style={{ fontSize: "20px", fontWeight: "500", marginBottom: "12px" }}>
          รางวัลที่แลกได้ในขณะนี้
        </div>
        <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "8px" }}>
          {/* Card 1 */}
          <div style={{ minWidth: "220px", background: "#fff", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "18px", color: "#fff", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src="https://img.freepik.com/free-vector/game-background-cartoon-style_23-2148163033.jpg?w=400" alt="Smash Party" style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "12px", marginBottom: "10px" }} />
            <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "8px" }}>🎮 Smash Party</div>
            <div style={{ fontSize: "14px", marginBottom: "6px" }}>ใช้ 280 คะแนน</div>
            <div style={{ fontSize: "13px", opacity: 0.85 }}>รับสูงสุด 180 บาท</div>
          </div>
          {/* Card 2 */}
          <div style={{ minWidth: "220px", background: "#fff", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "18px", color: "#fff", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src="https://img.freepik.com/free-vector/hand-drawn-dolphin-cartoon-illustration_23-2150271002.jpg?w=400" alt="Ocean Match" style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "12px", marginBottom: "10px" }} />
            <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "8px" }}>🐬 Ocean Match</div>
            <div style={{ fontSize: "14px", marginBottom: "6px" }}>ใช้ 300 คะแนน</div>
            <div style={{ fontSize: "13px", opacity: 0.85 }}>รับสูงสุด 210 บาท</div>
          </div>
          {/* Card 3 */}
          <div style={{ minWidth: "220px", background: "#fff", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "18px", color: "#fff", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src="https://img.freepik.com/free-vector/golden-pot-coins-cartoon-style_1308-131774.jpg?w=400" alt="Slots Gold" style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "12px", marginBottom: "10px" }} />
            <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "8px" }}>🏆 Slots Gold</div>
            <div style={{ fontSize: "14px", marginBottom: "6px" }}>ใช้ 260 คะแนน</div>
            <div style={{ fontSize: "13px", opacity: 0.85 }}>รับสูงสุด 150 บาท</div>
          </div>
        </div>
      </div>

      {/* คะแนนล่าสุด */}
      <div style={{ width: "100%", maxWidth: "900px", marginTop: "40px" }}>
        <div style={{ fontSize: "20px", fontWeight: "500", marginBottom: "12px" }}>
          คะแนนที่ได้รับล่าสุด
        </div>
        <div
          style={{
            background: "#FEF6DF",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "#FEF6DF",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px"
                  }}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>{activity.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{activity.date}</div>
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(to right, #F472B6, #EC4899)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                +{activity.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup ปฏิทิน */}
      {showCalendarPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px 24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            minWidth: "340px",
            maxWidth: "90vw",
            position: "relative"
          }}>
            <div style={{ fontWeight: "600", fontSize: "20px", marginBottom: "16px", textAlign: "center" }}>ประวัติการรับคะแนนรายวัน</div>
            <ReactCalendar
              value={null}
              tileClassName={({ date }) =>
                checkinDates.some(d => d.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
                  ? 'checkin-highlight'
                  : undefined
              }
            />
            <div style={{ textAlign: "center", marginTop: "12px", color: "#6b7280", fontSize: "15px" }}>
              เช็คอินแล้ว {checkinDates.length} วัน
            </div>
            <button
              style={{
                marginTop: "24px",
                background: "#F472B6",
                color: "white",
                padding: "10px 24px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto"
              }}
              onClick={() => setShowCalendarPopup(false)}
            >
              ปิด
            </button>
            <style>{`
              .checkin-highlight {
                background: #F9A8D4 !important;
                color: white !important;
                border-radius: 50% !important;
              }
            `}</style>
          </div>
        </div>
      )}

    </div>
  );
}