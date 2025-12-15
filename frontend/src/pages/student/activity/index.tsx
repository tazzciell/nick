import * as React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { GetMyActivities } from '@/services/activityService';
import { GetImagesByActivityId, formatBase64ToDataURL } from '@/services/documentService';

// ============================================
// Activity Card Component
// ============================================
interface ActivityCardProps {
  id: number;
  name: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  type?: string;
  status?: string;
  approval_status?: string; // ✅ เพิ่ม
  poster_url?: string;
  onClick?: () => void;
}

function ActivityCard({ 
  id,
  name,
  location,
  start_date, 
  end_date,
  start_time,
  end_time,
  type,
  status,
  approval_status, // ✅ เพิ่ม
  poster_url,
  onClick
}: ActivityCardProps) {
  const [imageError, setImageError] = React.useState(false);

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return 'ไม่ระบุวันที่';
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Type badge color
  const getTypeBadge = () => {
    const colors: Record<string, string> = {
      volunteer: 'bg-green-100 text-green-700 border-green-200',
      academic: 'bg-blue-100 text-blue-700 border-blue-200',
      sport: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels: Record<string, string> = {
      volunteer: 'กิจกรรมจิตอาสา',
      academic: 'กิจกรรมวิชาการ',
      sport: 'กิจกรรมกีฬา'
    };
    const colorClass = colors[type || ''] || 'bg-slate-100 text-slate-700 border-slate-200';
    const label = labels[type || ''] || '📋 อื่นๆ';
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
        {label}
      </span>
    );
  };

  // ✅ Approval Status Badge (สถานะการอนุมัติ)
  const getApprovalBadge = () => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels: Record<string, string> = {
      pending: 'รออนุมัติ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ปฏิเสธ'
    };
    
    const colorClass = colors[approval_status || ''] || 'bg-slate-100 text-slate-700 border-slate-200';
    const label = labels[approval_status || ''] || '📝 ไม่ระบุ';
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 hover:border-slate-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {poster_url && !imageError ? (
          <img
            src={poster_url}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Users className="size-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap justify-between items-start gap-2">
          {type && getTypeBadge()}
          {/* ✅ แสดง Approval Status แทน Activity Status */}
          {approval_status && getApprovalBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Details */}
        <div className="space-y-2 text-sm text-slate-600">
          {/* Date */}
          {(start_date || end_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1">
                {formatDate(start_date)}
                {end_date && ` - ${formatDate(end_date)}`}
              </span>
            </div>
          )}

          {/* Time */}
          {(start_time || end_time) && (
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1">
                {start_time}
                {end_time && ` - ${end_time}`}
              </span>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
          >
            ดูรายละเอียด →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Index Page
// ============================================
export default function IndexPage() {
  const navigate = useNavigate();
  
  // State
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch activities with images
  React.useEffect(() => {
    const fetchActivitiesWithImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลกิจกรรม
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
        
        if (activitiesData && typeof activitiesData === 'object' && !Array.isArray(activitiesData)) {
          if (Array.isArray(activitiesData.data)) {
            activitiesData = activitiesData.data;
          } else if (Array.isArray(activitiesData.activities)) {
            activitiesData = activitiesData.activities;
          }
        }

        if (!Array.isArray(activitiesData)) {
          console.error('❌ Response is not an array:', activitiesData);
          setActivities([]);
          setLoading(false);
          return;
        }

        console.log('📥 Fetched my activities:', activitiesData.length);

        // ดึงรูปภาพ
        const activitiesWithImages = await Promise.all( 
          activitiesData.map(async (activity: any) => {
            try {
              const imageRes = await GetImagesByActivityId(activity.ID);
              
              if (imageRes?.status === 200 && imageRes.data?.data?.length > 0) {
                const base64Data = imageRes.data.data[0];
                
                if (typeof base64Data === 'string' && base64Data) {
                  const posterUrl = formatBase64ToDataURL(base64Data);
                  
                  return {
                    ...activity,
                    poster_url: posterUrl
                  };
                }
              }
            } catch (err: any) {
              console.error(`❌ Error loading image for Activity ${activity.ID}:`, err.message);
            }
            return activity;
          })
        );

        setActivities(activitiesWithImages);
        console.log('✅ My activities loaded:', activitiesWithImages.length);

      } catch (err: any) {
        console.error('❌ Error fetching activities:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesWithImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20 py-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="size-5 text-slate-700" />
              </Button>
              <div className="h-8 w-px bg-slate-200" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                สถานะฟอร์มกิจกรรม
              </h1>
            </div> 
            
            <Link to="/student/activities/postactivities">
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-xl gap-2.5 px-6 py-2.5 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-900/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Plus className="size-5" strokeWidth={2.5} />
                <span className="font-semibold text-sm">โพสต์กิจกรรมใหม่</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="w-full px-6 sm:px-12 lg:px-16 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
            <p className="text-slate-600 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
            <Users className="size-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              ยังไม่มีกิจกรรม
            </h3>
            <p className="text-slate-600 mb-6">
              เริ่มต้นโพสต์กิจกรรมแรกของคุณกันเลย!
            </p>
            <Link to="/student/activities/postactivities">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600"
              >
                <Plus className="size-5 mr-2" />
                โพสต์กิจกรรมใหม่
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                พบทั้งหมด <span className="font-bold text-slate-900">{activities.length}</span> กิจกรรม
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.ID}
                  id={activity.ID}
                  name={activity.ActivityName}
                  location={activity.location_name}
                  start_date={activity.StartDate}
                  end_date={activity.EndDate}
                  start_time={activity.StartTime}
                  end_time={activity.EndTime}
                  type={activity.Type}
                  status={activity.Status}
                  approval_status={activity.status} 
                  poster_url={activity.poster_url}
                  onClick={() => navigate(`/student/activities/${activity.ID}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}