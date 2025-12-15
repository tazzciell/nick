import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import { getImageUrl } from "@/utils/imageUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/interfaces/user";

export default function ProfileDemoPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล users จาก API
  useEffect(() => {
    apiClient
      .get("/users")
      .then((res) => {
        if (res.data) setUsers(res.data);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  const otherUsers = users.filter((u) => u.sut_id !== currentUser?.sut_id);

  // Function สำหรับไปหน้า profile
  const goToProfile = (sutId: string) => {
    navigate(`/student/profile-skill/${sutId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Demo: ดู Profile คนอื่น
          </h1>
          <p className="text-slate-600">
            คุณ login เป็น:{" "}
            <strong className="text-blue-600">
              {currentUser?.first_name} {currentUser?.last_name}
            </strong>{" "}
            ({currentUser?.sut_id})
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>วิธีใช้:</strong> คลิกที่การ์ดของคนอื่นเพื่อดูโปรไฟล์
            </p>
          </div>
        </div>

        {/* Users Grid */}
        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          สมาชิกในระบบ ({otherUsers.length} คน)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {otherUsers.map((member) => (
            <Card
              key={member.sut_id}
              onClick={() => goToProfile(member.sut_id)}
              className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-blue-400"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-200 hover:ring-blue-400 transition-all mb-4">
                  <img
                    src={getImageUrl(member.avatar_url)}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-slate-500 text-sm mb-2">{member.sut_id}</p>
                {member.year && (
                  <Badge variant="secondary">ชั้นปี {member.year}</Badge>
                )}
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                  ดูโปรไฟล์ →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {otherUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-slate-500">ไม่พบผู้ใช้คนอื่นในระบบ</p>
          </div>
        )}

        {/* Code Example */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Code ที่เพื่อนต้องใช้</h3>
          <pre className="text-sm text-green-400 overflow-x-auto">
            {`// 1. Import
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/apiClient";
import type { User } from "@/interfaces/user";

// 2. ดึงข้อมูล users
const [users, setUsers] = useState<User[]>([]);
useEffect(() => {
  apiClient.get("/users").then(res => setUsers(res.data));
}, []);

// 3. Navigate ไปหน้า profile
const navigate = useNavigate();
const goToProfile = (sutId: string) => {
  navigate(\`/student/profile-skill/\${sutId}\`);
};

// 4. แสดง avatar ที่คลิกได้
<img 
  src={user.avatar_url}
  onClick={() => goToProfile(user.sut_id)}
  className="w-10 h-10 rounded-full cursor-pointer"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
