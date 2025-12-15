import {
  Settings,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Star,
  Trophy,
  Briefcase,
  Award,
  Coins,
} from "lucide-react";
import type { MenuItem } from "../student/studentMenu";

// Admin Menu Items - ครบ 10 ระบบ
export const adminMenuItems: MenuItem[] = [
 
  // ระบบจัดการกิจกรรมและการแข่งขัน
  {
    id: "events",
    label: "จัดการกิจกรรม",
    icon: Calendar,
    path: "/admin/events",
  },
  // ระบบคำร้องขอจัดตั้งทีมและโครงการ
  {
    id: "activity",
    label: "จัดการแบบฟอร์มกิจกรรม",
    icon: FileText,
    path: "/admin/activity",
  },
  // ระบบสื่อสารภายในกิจกรรม
  {
    id: "communication",
    label: "การสื่อสาร",
    icon: MessageSquare,
    path: "/admin/communication",
  },
  // ระบบลงทะเบียนและจัดการทีม
  {
    id: "teams",
    label: "จัดการทีม",
    icon: Users,
    path: "/admin/teams",
  },
  // ระบบประเมินและความคิดเห็นกิจกรรม
  {
    id: "feedback",
    label: "ผลประเมิน",
    icon: Star,
    path: "/admin/feedback",
  },
  // ระบบประกาศผลและสรุปกิจกรรม
  {
    id: "results",
    label: "ประกาศผล",
    icon: Trophy,
    path: "/admin/results",
  },
  // ระบบคลังผลงานนักศึกษา
  {
    id: "portfolio",
    label: "คลังผลงาน",
    icon: Briefcase,
    path: "/admin/portfolio",
  },
  // ระบบรับรองผลการเข้าร่วมกิจกรรม
  {
    id: "certificates",
    label: "ใบประกาศนียบัตร",
    icon: Award,
    path: "/admin/certificates",
  },
  // ระบบจัดการคะแนนและแต้มสะสม
  {
    id: "points",
    label: "คะแนนสะสม",
    icon: Coins,
    path: "/admin/points",
  },

  {
    id: "setting",
    label : "การตั้งค่า",
    icon : Settings,
    path : "/admin/setting",
  },

];
