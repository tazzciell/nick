import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, BookOpen, FileText, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GetImagesByActivityId, formatBase64ToDataURL } from '@/services/documentService';
import { GetMyActivities } from '@/services/activityService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Activity Info Interface
interface ActivityInfo {
  id: string;
  title: string;
  emoji: string;
  date: string;
  location: string;
  gradient: string;
  maxParticipants: number | null;
  currentParticipants: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

export default function ActivityRegistration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // States
  const [activity, setActivity] = useState<ActivityInfo | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    phone: '',
    faculty: '',
    major: '',
    year: '',
    allergies: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    shirtSize: '',
    note: '',
  });

  // ✅ ฟังก์ชัน Format วันที่
  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ✅ ฟังก์ชันกำหนด Emoji ตามประเภท
  const getEmojiByType = (type?: string) => {
    const emojiMap: Record<string, string> = {
      volunteer: '🤝',
      academic: '📚',
      sport: '⚽',
    };
    return emojiMap[type || ''] || '🎯';
  };

  // ✅ ฟังก์ชันกำหนด Gradient ตามประเภท
  const getGradientByType = (type?: string) => {
    const gradientMap: Record<string, string> = {
      volunteer: 'from-green-400 to-emerald-500',
      academic: 'from-blue-400 to-indigo-500',
      sport: 'from-orange-400 to-red-500',
    };
    return gradientMap[type || ''] || 'from-indigo-400 to-purple-500';
  };

  // ✅ Fetch ข้อมูลกิจกรรมตาม ID
  useEffect(() => {
    const fetchActivityDetails = async () => {
      // ✅ Debug: แสดง URL และ ID
      console.log('🔍 Current URL:', location.pathname);
      console.log('🔍 Activity ID from params:', id);
      console.log('🔍 Location state:', location.state);

      if (!id) {
        console.error('❌ No ID found in URL params');
        setError('ไม่พบ ID กิจกรรม - กรุณาตรวจสอบ URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลกิจกรรมทั้งหมด
        const response = await GetMyActivities();
        
        console.log('📥 Full response:', response);
        
        if (response.status === 401) {
          setError('กรุณา Login ใหม่');
          setLoading(false);
          return;
        }

        if (response.status !== 200) {
          throw new Error(response.data?.error || 'ไม่สามารถดึงข้อมูลได้');
        }

        let activitiesData = response.data;
        
        // แปลงข้อมูลให้เป็น Array
        if (activitiesData && typeof activitiesData === 'object' && !Array.isArray(activitiesData)) {
          if (Array.isArray(activitiesData.data)) {
            activitiesData = activitiesData.data;
          } else if (Array.isArray(activitiesData.activities)) {
            activitiesData = activitiesData.activities;
          }
        }

        if (!Array.isArray(activitiesData)) {
          console.error('❌ Response is not an array:', activitiesData);
          setError('ไม่สามารถดึงข้อมูลได้');
          setLoading(false);
          return;
        }

        console.log('📥 All activities:', activitiesData.length);
        console.log('🔍 Looking for activity with ID:', id);

        // ✅ หากิจกรรมที่ตรงกับ ID
        const foundActivity = activitiesData.find(
          (act: any) => {
            console.log('Comparing:', act.ID, 'with', id);
            return act.ID.toString() === id.toString();
          }
        );

        if (!foundActivity) {
          console.error('❌ Activity not found. Available IDs:', activitiesData.map((a: any) => a.ID));
          setError('ไม่พบกิจกรรมที่ต้องการ');
          setLoading(false);
          return;
        }

        console.log('✅ Found activity:', foundActivity);

        // ✅ ดึงรูปภาพของกิจกรรม
        try {
          const imageRes = await GetImagesByActivityId(foundActivity.ID);
          
          if (imageRes?.status === 200 && imageRes.data?.data?.length > 0) {
            const base64Data = imageRes.data.data[0];
            
            if (typeof base64Data === 'string' && base64Data) {
              const posterDataUrl = formatBase64ToDataURL(base64Data);
              setPosterUrl(posterDataUrl);
              console.log('✅ Image loaded');
            }
          }
        } catch (imgErr: any) {
          console.error('❌ Error loading image:', imgErr.message);
        }

        // ✅ Set ข้อมูลกิจกรรม
        const dateRange = `${formatDate(foundActivity.StartDate)}${
          foundActivity.EndDate ? ` - ${formatDate(foundActivity.EndDate)}` : ''
        }`;

        setActivity({
          id: foundActivity.ID.toString(),
          title: foundActivity.ActivityName || 'ไม่ระบุชื่อกิจกรรม',
          emoji: getEmojiByType(foundActivity.Type),
          date: dateRange,
          location: foundActivity.location_name || 'ไม่ระบุสถานที่',
          gradient: getGradientByType(foundActivity.Type),
          maxParticipants: foundActivity.MaxParticipants || null,
          currentParticipants: foundActivity.CurrentParticipants || 0,
          type: foundActivity.Type,
          startDate: foundActivity.StartDate,
          endDate: foundActivity.EndDate,
          startTime: foundActivity.StartTime,
          endTime: foundActivity.EndTime,
        });

        console.log('✅ Activity loaded successfully');

      } catch (err: any) {
        console.error('❌ Error fetching activity:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [id, location]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Registration data:', { activityId: id, ...formData });
      
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccessDialog(true);
        
        setTimeout(() => {
          navigate(`/student/activities/${id}`);
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
      setIsLoading(false);
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">กำลังโหลดข้อมูล...</p>
          <p className="text-xs text-slate-400 mt-2">Activity ID: {id || 'ไม่พบ'}</p>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-slate-600 mb-2">{error}</p>
            <p className="text-xs text-slate-400 mb-6">URL: {location.pathname}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => navigate('/student/activities')}
                variant="outline"
              >
                <ArrowLeft className="mr-2 size-4" />
                กลับหน้ากิจกรรม
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
              >
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ No Activity Found
  if (!activity) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">ไม่พบข้อมูลกิจกรรม</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/student/activities/${id}`)}
              >
                <ArrowLeft className="size-5" />
              </Button>
              <h1 className="text-xl font-bold">ลงทะเบียนเข้าร่วมกิจกรรม</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Activity Info Banner with Image */}
        <Card className="mb-6 overflow-hidden">
          {/* ✅ รูปภาพกิจกรรม */}
          {posterUrl ? (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={posterUrl} 
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* ข้อมูลทับรูป */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-5xl">{activity.emoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{activity.title}</h2>
                    <p className="text-white/90">{activity.date} | {activity.location}</p>
                  </div>
                </div>
              </div>

              {/* Badge ที่ว่าง */}
              {activity.maxParticipants && (
                <Badge className="absolute top-4 right-4 bg-white text-slate-900">
                  ที่ว่าง {activity.maxParticipants - activity.currentParticipants} คน
                </Badge>
              )}
            </div>
          ) : (
            // ✅ กรณีไม่มีรูป - แสดง Gradient
            <div className={cn(
              'relative h-48 bg-gradient-to-br',
              activity.gradient,
              'flex items-center justify-center'
            )}>
              <div className="absolute inset-0 flex items-center px-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{activity.emoji}</div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">{activity.title}</h2>
                    <p className="text-white/90">{activity.date} | {activity.location}</p>
                  </div>
                </div>
              </div>

              {/* Badge ที่ว่าง */}
              {activity.maxParticipants && (
                <Badge className="absolute top-4 right-4 bg-white text-slate-900">
                  ที่ว่าง {activity.maxParticipants - activity.currentParticipants} คน
                </Badge>
              )}

              {/* ไอคอนไม่มีรูป */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Users className="size-32 text-white" />
              </div>
            </div>
          )}
        </Card>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>แบบฟอร์มลงทะเบียน</CardTitle>
              <CardDescription>
                กรุณากรอกข้อมูลให้ครบถ้วน เพื่อใช้ในการลงทะเบียนเข้าร่วมกิจกรรม
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Section 1: Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="size-5 text-indigo-600" />
                  ข้อมูลส่วนตัว
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">ชื่อ *</Label>
                    <Input
                      id="firstName"
                      placeholder="ชื่อจริง"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">นามสกุล *</Label>
                    <Input
                      id="lastName"
                      placeholder="นามสกุล"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId">รหัสนักศึกษา *</Label>
                    <Input
                      id="studentId"
                      placeholder="6512345678"
                      value={formData.studentId}
                      onChange={(e) => updateFormData('studentId', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.ac.th"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0XX-XXX-XXXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="size-5 text-indigo-600" />
                  ข้อมูลการศึกษา
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty">คณะ *</Label>
                    <Input
                      id="faculty"
                      placeholder="เช่น คณะวิศวกรรมศาสตร์"
                      value={formData.faculty}
                      onChange={(e) => updateFormData('faculty', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">สาขาวิชา *</Label>
                    <Input
                      id="major"
                      placeholder="เช่น วิศวกรรมคอมพิวเตอร์"
                      value={formData.major}
                      onChange={(e) => updateFormData('major', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">ชั้นปี *</Label>
                    <Input
                      id="year"
                      placeholder="เช่น 1, 2, 3, 4"
                      value={formData.year}
                      onChange={(e) => updateFormData('year', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shirtSize">ไซส์เสื้อ</Label>
                    <Input
                      id="shirtSize"
                      placeholder="S, M, L, XL, XXL"
                      value={formData.shirtSize}
                      onChange={(e) => updateFormData('shirtSize', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Emergency Contact */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className="size-5 text-red-600" />
                  ข้อมูลผู้ติดต่อฉุกเฉิน
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">ชื่อผู้ติดต่อฉุกเฉิน *</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="ชื่อ-นามสกุล"
                      value={formData.emergencyContact}
                      onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">เบอร์โทรศัพท์ฉุกเฉิน *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="0XX-XXX-XXXX"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Health Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-green-600" />
                  ข้อมูลสุขภาพ
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">อาการแพ้ (ถ้ามี)</Label>
                    <textarea
                      id="allergies"
                      rows={3}
                      className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:shadow-md focus:shadow-slate-200/60"
                      placeholder="เช่น แพ้อาหารทะเล, แพ้ยา, แพ้ฝุ่น"
                      value={formData.allergies}
                      onChange={(e) => updateFormData('allergies', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">โรคประจำตัว (ถ้ามี)</Label>
                    <textarea
                      id="medicalConditions"
                      rows={3}
                      className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:shadow-md focus:shadow-slate-200/60"
                      placeholder="เช่น โรคหอบหืด, โรคเบาหวาน, โรคหัวใจ"
                      value={formData.medicalConditions}
                      onChange={(e) => updateFormData('medicalConditions', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Additional Note */}
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="note">หมายเหตุเพิ่มเติม</Label>
                  <textarea
                    id="note"
                    rows={4}
                    className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:shadow-md focus:shadow-slate-200/60"
                    placeholder="ข้อมูลเพิ่มเติมหรือข้อความถึงผู้จัดกิจกรรม"
                    value={formData.note}
                    onChange={(e) => updateFormData('note', e.target.value)}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="border-t pt-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      className="mt-1"
                    />
                    <span className="text-sm text-slate-700">
                      ข้าพเจ้ายืนยันว่าข้อมูลที่กรอกเป็นความจริงทุกประการ และยอมรับเงื่อนไขการเข้าร่วมกิจกรรม
                      รวมถึงข้อกำหนดด้านความปลอดภัยและการปฏิบัติตามกฎระเบียบของกิจกรรม
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate(`/student/activities/${id}`)}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 min-w-[150px]"
                  size="lg"
                >
                  {isLoading ? (
                    'กำลังลงทะเบียน...'
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 size-5" />
                      ยืนยันการลงทะเบียน
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">ลงทะเบียนสำเร็จ!</DialogTitle>
            <DialogDescription className="text-center">
              <p className="mb-2">
                ข้อมูลการลงทะเบียนของคุณถูกส่งเรียบร้อยแล้ว
              </p>
              <p className="text-sm text-slate-600">
                กรุณารอการอนุมัติจากผู้จัดกิจกรรม<br />
                คุณจะได้รับการแจ้งเตือนผ่านอีเมลเมื่อได้รับการอนุมัติ
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}