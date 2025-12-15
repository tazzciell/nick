import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  BarChart3,
  Edit,
  ExternalLink,
  Code2,
  Heart,
  Wrench,
  FileText,
  FolderOpen,
  Award,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import { getMyProfile, getUserProfile } from "../../../services/profileService";
import type { User } from "../../../interfaces/user";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/imageUtils";

// Social media icon mapping
const SOCIAL_ICON_MAP: Record<
  string,
  { icon: React.ElementType; hoverColor: string }
> = {
  GitHub: {
    icon: Github,
    hoverColor: "hover:bg-gray-800 hover:border-gray-800",
  },
  LinkedIn: {
    icon: Linkedin,
    hoverColor: "hover:bg-[#0077B5] hover:border-[#0077B5]",
  },
  Twitter: {
    icon: Twitter,
    hoverColor: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
  },
  Instagram: {
    icon: Instagram,
    hoverColor: "hover:bg-[#E4405F] hover:border-[#E4405F]",
  },
  Facebook: {
    icon: Facebook,
    hoverColor: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
};
export default function StudentProfileSkillPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const isOwnProfile = !userId || userId === user?.sut_id;

  const fetchProfile = async () => {
    try {
      const response = isOwnProfile
        ? await getMyProfile()
        : await getUserProfile(userId!);
      if (response?.error || !response?.data) {
        console.error("Error fetching profile:", response?.error);
        return;
      }
      console.log("userData:", response.data);
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [userId, isOwnProfile]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 gap-3">
        <Spinner className="size-8 text-slate-600" />
        <p className="text-slate-600 text-sm">กำลังโหลดข้อมูลโปรไฟล์...</p>
      </div>
    );
  }
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <p className="text-red-600">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    );
  }
  const skills = userData.skills;
  const interests = userData.interests;
  const tools = userData.tools;

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="max-w-8xl mx-auto px-10 py-10">
        {/* Profile Header */}
        <Card className="bg-white border-slate-200 mb-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center group">
                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-slate-900 ring-offset-4 ring-offset-white transition-all duration-300 group-hover:ring-blue-500 group-hover:ring-offset-blue-100 group-hover:scale-105">
                  <img
                    src={getImageUrl(userData.avatar_url)}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-4 text-slate-500 text-sm font-mono">
                  @{userData.sut_id}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {userData.first_name} {userData.last_name}
                  </h1>
                  <p className="text-slate-600 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </p>
                </div>

                {/* Social Media Icons */}
                {userData.socials && userData.socials.length > 0 && (
                  <div className="flex gap-3 justify-center md:justify-start mb-6">
                    {userData.socials.map((social, index) => {
                      const socialConfig = SOCIAL_ICON_MAP[social.platform];
                      if (!socialConfig) return null;
                      const IconComponent = socialConfig.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-900 flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 hover:-translate-y-1 ${socialConfig.hoverColor}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 px-4 py- rounded-lg borderborder-slate-50 hover:bg-blue-60 hover:border-blue-200 hover:scale-[1.02] transition-all duration-200 cursor-default group">
                    <GraduationCap className="w-5 h-5 text-black group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm text-black group-hover:text-blue-700 transition-colors">
                      {userData.faculty?.name || "ไม่ระบุคณะ"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-50 hover:bg-green-60 hover:border-green-200 hover:scale-[1.02] transition-all duration-200 cursor-default group">
                    <BookOpen className="w-5 h-5 text-black group-hover:text-green-600 transition-colors" />
                    <span className="text-sm text-black group-hover:text-green-700 transition-colors">
                      {userData.major?.name || "ไม่ระบุสาขา"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-50 hover:bg-purple-60 hover:border-purple-200 hover:scale-[1.02] transition-all duration-200 cursor-default group">
                    <Phone className="w-5 h-5 text-black group-hover:text-purple-600 transition-colors" />
                    <span className="text-sm  text-black group-hover:text-purple-700 transition-colors">
                      {userData.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-50 hover:bg-orange-50 hover:border-orange-200 hover:scale-[1.02] transition-all duration-200 cursor-default group">
                    <BarChart3 className="w-5 h-5 text-black group-hover:text-orange-600 transition-colors" />
                    <span className="text-sm text-black group-hover:text-orange-700 transition-colors">
                      ชั้นปีที่ {userData.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skills */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Code2 className="w-5 h-5 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  ทักษะ (Skills)
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[120px]">
                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <p className="text-slate-500 text-sm">ยังไม่มีทักษะ</p>
                  ) : (
                    skills.map((skill: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:scale-110 border cursor-pointer transition-all duration-200 hover:shadow-md px-3 py-1.5 text-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Heart className="w-5 h-5 text-orange-500 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
                  สิ่งที่สนใจ
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[120px]">
                <div className="flex flex-wrap gap-2">
                  {interests.length === 0 ? (
                    <p className="text-slate-500 text-sm">ยังไม่มีความสนใจ</p>
                  ) : (
                    interests.map((interest: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 hover:scale-110 border cursor-pointer transition-all duration-200 hover:shadow-md px-3 py-1.5 text-sm"
                      >
                        {interest}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Wrench className="w-5 h-5 text-green-500 group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300" />
                  เครื่องมือ
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[120px]">
                <div className="flex flex-wrap gap-2">
                  {tools.length === 0 ? (
                    <p className="text-slate-500 text-sm">ยังไม่มีเครื่องมือ</p>
                  ) : (
                    tools.map((tool: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:scale-110 border cursor-pointer transition-all duration-200 hover:shadow-md px-3 py-1.5 text-sm"
                      >
                        {tool}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* About Me */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <FileText className="w-5 h-5 text-slate-600 " />
                    เกี่ยวกับฉัน About Me
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-xl p-5  transition-all duration-300">
                  <p className="text-slate-700 leading-relaxed">
                    {userData.bio || "ยังไม่ได้เขียนข้อมูลเกี่ยวกับตัวเอง"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <FolderOpen className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-all duration-300" />
                    Portfolio
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/student/portfolio")}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">ดูทั้งหมด</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 text-sm">
                  แสดงผลงานและโครงการของคุณที่นี่
                </p>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Award className="w-5 h-5 text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                    Certificates
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/student/certificates")}
                    className="flex items-center gap-2 hover:bg-green-50 hover:border-green-500 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">ดูทั้งหมด</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 text-sm">
                  แสดงใบรับรองและประกาศนียบัตรของคุณที่นี่
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        {isOwnProfile && (
          <div className="fixed bottom-8 right-8 z-50 group">
            <div className="absolute inset-0" />
            <Button
              onClick={() => navigate("/student/profile-skill/edit")}
              className="relative flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl bg-slate-900 text-white"
              size="lg"
            >
              <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              แก้ไขโปรไฟล์
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
