import * as React from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar,
  Timer, 
  MapPin, 
  Users, 
  Share2,
  Tag,
  Building2,
  Map,
  ExternalLink,
  Navigation,
  Trophy,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GetActivityById } from '@/services/activityService';
import { GetImagesByActivityId, formatBase64ToDataURL } from '@/services/documentService';

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activity, setActivity] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [posterUrl, setPosterUrl] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const formatDate = (date?: string) => {
    if (!date) return 'ไม่ระบุวันที่';
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const d = new Date(time);
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTypeBadge = (type?: string) => {
    const config: Record<string, { label: string; color: string }> = {
      volunteer: { label: 'กิจกรรมจิตอาสา', color: 'bg-green-500 text-white' },
      academic: { label: 'กิจกรรมวิชาการ', color: 'bg-blue-500 text-white' },
      sport: { label: 'กิจกรรมกีฬา', color: 'bg-orange-500 text-white' }
    };
    
    const { label, color } = config[type || ''] || { 
      label: 'กิจกรรม', 
      color: 'bg-slate-500 text-white' 
    };
    
    return (
      <Badge className={`${color} px-4 py-1.5 text-sm font-semibold rounded-full`}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status?: string) => {
    const config: Record<string, { label: string; color: string }> = {
      pending: { label: 'รออนุมัติ', color: 'bg-yellow-500 text-white' },
      approved: { label: 'อนุมัติแล้ว', color: 'bg-green-500 text-white' },
      rejected: { label: 'ปฏิเสธ', color: 'bg-red-500 text-white' }
    };
    
    const { label, color } = config[status || ''] || { 
      label: 'ไม่ระบุ', 
      color: 'bg-slate-500 text-white'
    };
    
    return (
      <Badge className={`${color} px-4 py-1.5 text-sm font-semibold rounded-full`}>
        {label}
      </Badge>
    );
  };

  React.useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
  
      try {
        setLoading(true);
        setError('');
        
        const response = await GetActivityById(id);
        
        console.log('📥 Full Response:', response);
        
        if (response.status === 200) {
          let activityData;
          
          if (response.data?.activity) {
            activityData = response.data.activity;
          } else if (response.data?.data) {
            activityData = response.data.data;
          } else {
            activityData = response.data;
          }
          
          console.log('📋 Activity Data:', activityData);
          console.log('📍 Location Data:', activityData?.Location || activityData?.location);
          setActivity(activityData);
          
          // ดึงรูปภาพ
          if (activityData?.ID) {
            try {
              const imageRes = await GetImagesByActivityId(activityData.ID);
              console.log('🖼️ Image Response:', imageRes);
              
              if (imageRes?.status === 200 && imageRes.data?.data?.length > 0) {
                const base64Data = imageRes.data.data[0];
                if (typeof base64Data === 'string') {
                  setPosterUrl(formatBase64ToDataURL(base64Data));
                  console.log('✅ Poster loaded');
                }
              }
            } catch (imgErr) {
              console.error('❌ Error loading image:', imgErr);
            }
          }
        } else {
          setError('ไม่สามารถโหลดข้อมูลได้');
        }
      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-900 mb-4 mx-auto"></div>
          <p className="text-slate-600 font-semibold">กำลังโหลด...</p>
        </div>
      </div> 
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" /> กลับ
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-700 font-bold text-xl mb-2">ไม่พบข้อมูลกิจกรรม</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ดึงข้อมูล Location
  const location = activity.Location || activity.location;
  const hasMapData = location?.map_url || (location?.latitude && location?.longitude);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="h-8 w-px bg-slate-200" />
              <h1 className="text-xl font-bold">รายละเอียดกิจกรรม</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Poster */}
        <Card className="mb-6 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={activity.ActivityName || activity.name} 
                className="w-full h-auto object-contain max-h-[600px] bg-slate-100"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Users className="size-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">ไม่มีรูปภาพ</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ชื่อกิจกรรม */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            {activity.ActivityName || activity.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {getTypeBadge(activity.type)}
            {getStatusBadge(activity.status)}
          </div>
        </div>

        {/* ข้อมูลพื้นฐาน */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">ข้อมูลกิจกรรม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* วันที่และเวลา */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 mb-1">วันที่จัดกิจกรรม</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(activity.start_date)} - {formatDate(activity.end_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Timer className="size-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 mb-1">เวลา</p>
                  <p className="font-semibold text-slate-900">
                    {formatTime(activity.start_time)} - {formatTime(activity.end_time)} น.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* สถานที่ */}
            <div className="flex items-start gap-3">
              <Building2 className="size-5 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">สถานที่จัดกิจกรรม</p>
                <p className="font-semibold text-slate-900 text-lg">
                  {location?.building} ห้อง {location?.room}
                </p>
                {location?.detail && (
                  <p className="text-sm text-slate-600 mt-1">{location.detail}</p>
                )}
              </div>
            </div>

            {/* แสดงข้อมูลแผนที่ (ถ้ามี) */}
            {hasMapData && (
              <>
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Map className="size-5 text-green-600" />
                    <span>ข้อมูลแผนที่</span>
                  </div>

                  {/* Google Maps Link */}
                  {location?.map_url && (
                    <a
                      href={location.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Navigation className="size-4" />
                      <span className="text-sm font-medium">เปิดใน Google Maps</span>
                      <ExternalLink className="size-4" />
                    </a>
                  )}

                  {/* พิกัด */}
                  {location?.latitude && location?.longitude && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="size-4 text-red-500" />
                      <span>
                        พิกัด: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </span>
                    </div>
                  )}

                  {/* รูปสถานที่ */}
                  {location?.place_image_url && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-600 mb-2">รูปภาพสถานที่</p>
                      <img
                        src={location.place_image_url}
                        alt="สถานที่จัดกิจกรรม"
                        className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Embedded Google Map */}
                  {location?.latitude && location?.longitude && (
                    <div className="mt-4">
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ปุ่มสมัคร */}
        <div className="mb-6">
          <Link to={`/student/activities/${activity?.ID}/register`}>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold py-6 text-lg shadow-lg"
            >
              สมัครเข้าร่วมกิจกรรม
            </Button>
          </Link>
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* รายละเอียดกิจกรรม */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>รายละเอียดกิจกรรม</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">
                {activity.detail || 'ไม่มีรายละเอียด'}
              </p>
            </CardContent>
          </Card>

          {/* วัตถุประสงค์ */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>วัตถุประสงค์</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">
                {activity.objective || 'ไม่ระบุวัตถุประสงค์'}
              </p>
            </CardContent>
          </Card>

          {/* สวัสดิการ */}
          {activity.welfare && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="size-5 text-green-600" />
                  สวัสดิการ / สิทธิประโยชน์
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{activity.welfare}</p>
              </CardContent>
            </Card>
          )}

          {/* รางวัล */}
          {(activity.reward_first || activity.reward_second || activity.reward_third) && (
            <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-yellow-600" />
                  รางวัล
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.reward_first && (
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-white text-sm font-bold rounded-full flex-shrink-0">
                      1
                    </span>
                    <p className="text-slate-800 font-medium pt-1">{activity.reward_first}</p>
                  </div>
                )}
                {activity.reward_second && (
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-400 text-white text-sm font-bold rounded-full flex-shrink-0">
                      2
                    </span>
                    <p className="text-slate-800 font-medium pt-1">{activity.reward_second}</p>
                  </div>
                )}
                {activity.reward_third && (
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-700 text-white text-sm font-bold rounded-full flex-shrink-0">
                      3
                    </span>
                    <p className="text-slate-800 font-medium pt-1">{activity.reward_third}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ช่องทางติดต่อ */}
        {activity.user && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle>ช่องทางติดต่อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.user.email && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-20">📧 Email:</span>
                  <a
                    href={`mailto:${activity.user.email}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {activity.user.email}
                  </a>
                </div>
              )}
              {activity.user.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-20">📞 Phone:</span>
                  <a
                    href={`tel:${activity.user.phone}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {activity.user.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 