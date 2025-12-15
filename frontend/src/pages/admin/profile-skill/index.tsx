import { useState, useEffect } from "react";
import { Mail, Phone, User, Shield } from "lucide-react";
import { getMyProfile } from "@/services/profileService";
import type { User as UserType } from "@/interfaces/user";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/imageUtils";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response?.data && !response?.error) {
          setUserData(response.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Spinner className="size-6 text-gray-600" />
        <p className="text-gray-600 text-sm">กำลังโหลดข้อมูลโปรไฟล์...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        โปรไฟล์ผู้ดูแลระบบ
      </h1>

      <Card className="max-w-8xl">
        <CardContent className="p-6">
          <div className="flex flex-row sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-slate-900 ring-offset-4 ring-offset-white">
                <img
                  src={getImageUrl(userData.avatar_url)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-row text-center sm:text-left space-y-4">
              {/* Name & Role */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userData.first_name} {userData.last_name}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                    <Shield className="w-3 h-3 mr-1" />
                    {userData.role?.name || "Admin"}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-mono">{userData.sut_id}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{userData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
