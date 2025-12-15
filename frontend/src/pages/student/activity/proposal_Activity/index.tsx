import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload as UploadIcon, Plus, X, Trophy, Users, Gift, MapPin, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { convertFileToBase64 } from '@/services/documentService';
import { CreateActivity, GetLocations } from "../../../../services/activityService";
import { type LocationInterface } from "../../../../interfaces/Location";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function PostActivitiesComplete() {
  const navigate = useNavigate();

  // ===== Basic Info =====
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [objective, setObjective] = useState("");
  const [type, setType] = useState("");
  
  // ===== Date & Time =====
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // ===== Location =====
  const [locationID, setLocationID] = useState<number | null>(null);
  const [locationList, setLocationList] = useState<LocationInterface[]>([]);
  
  // ===== NEW: Rewards =====
  const [rewardFirst, setRewardFirst] = useState("");
  const [rewardSecond, setRewardSecond] = useState("");
  const [rewardThird, setRewardThird] = useState("");
  
  // ===== NEW: Team & Welfare =====
  const [teamNumber, setTeamNumber] = useState<number>(0);
  const [welfare, setWelfare] = useState("");
  
  // ===== NEW: Map/Location Coordinates =====
  const [mapURL, setMapURL] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [placeImageURL, setPlaceImageURL] = useState("");
  
  // ===== Files =====
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  
  // ===== Loading =====
  const [isLoading, setIsLoading] = useState(false);

  // ===== Handle Poster Upload =====
  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    try {
      setPosterFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      console.log("✅ เลือกรูปภาพสำเร็จ:", file.name);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }
  };

  const handleRemovePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    const fileInput = document.getElementById('poster-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // ===== Submit Form =====
  const onSubmit = async () => {
    // Validation
    if (!name.trim()) {
      alert("❌ กรุณากรอกชื่อกิจกรรม");
      return;
    }
    if (!locationID) {
      alert("❌ กรุณาเลือกสถานที่จัดกิจกรรม");
      return;
    }

    // เช็ควันที่
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        alert("❌ วันสิ้นสุดต้องมาหลังวันเริ่มต้น");
        return;
      }
    }

    setIsLoading(true);

    try {
      // แปลงรูปเป็น Base64
      let posterBase64 = "";
      if (posterFile) {
        console.log("🖼️ กำลังแปลงรูปภาพ...");
        posterBase64 = await convertFileToBase64(posterFile);
        console.log("✅ แปลง Base64 สำเร็จ");
      }

      // สร้าง payload
      const payload = {
        name: name.trim(),
        detail: detail.trim() || "",
        objective: objective.trim() || "",
        type: type || "",
        status: "pending",
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        start_time: startTime ? new Date(`2000-01-01T${startTime}`).toISOString() : null,
        end_time: endTime ? new Date(`2000-01-01T${endTime}`).toISOString() : null,
        location_id: locationID,
        poster_base64: posterBase64,
        
        // ✅ ฟิลด์ใหม่
        reward_first: rewardFirst.trim() || "",
        reward_second: rewardSecond.trim() || "",
        reward_third: rewardThird.trim() || "",
        team_number: teamNumber || 0,
        welfare: welfare.trim() || "",
        
        // ✅ ฟิลด์แผนที่
        map_url: mapURL.trim() || "",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        place_image_url: placeImageURL.trim() || "",
      };

      console.log("📤 กำลังส่งข้อมูล...", payload);

      const activityRes = await CreateActivity(payload);

      console.log("📥 Response:", activityRes);

      if (activityRes.status === 201 || activityRes.status === 200) {
        console.log("✅ สร้างกิจกรรมสำเร็จ!");
        
        const activityID = activityRes.data?.activity?.ID || 
                          activityRes.data?.ID;
        
        if (activityID) {
          navigate(`/student/activities/${activityID}`);
        } else {
          alert("🎉 สร้างกิจกรรมสำเร็จ!");
          navigate("/student/activity");
        }
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "เกิดข้อผิดพลาด";
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Fetch Locations =====
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await GetLocations();
        if (res.status === 200 && res.data) {
          setLocationList(res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div>
                <h1 className="text-xl font-bold text-slate-900">สร้างโพสต์กิจกรรม</h1>
                <p className="text-sm text-slate-500">กรุณากรอกรายละเอียดให้ครบถ้วน</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* ===== Card 1: รูปภาพโปสเตอร์ ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UploadIcon className="size-5 text-blue-600" />
                </div>
                รูปโปสเตอร์กิจกรรม
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!posterPreview ? (
                <>
                  <label
                    htmlFor="poster-upload"
                    className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="p-4 bg-blue-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="size-8 text-blue-600" />
                    </div>
                    <p className="text-slate-700 font-semibold">อัปโหลดรูปโปสเตอร์</p>
                    <p className="text-sm text-slate-500 mt-2">
                      รองรับ JPG, PNG, GIF • ไม่เกิน 5MB
                    </p>
                  </label>
                  <input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePosterChange}
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="w-full h-96 object-cover rounded-2xl border-2 border-slate-200 shadow-md"
                    />
                    
                    <button
                      type="button"
                      onClick={handleRemovePoster}
                      className="absolute top-3 right-3 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all hover:scale-110"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        📄 {posterFile?.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {((posterFile?.size || 0) / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    
                    <label htmlFor="poster-upload-replace">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Plus className="size-4 mr-2" />
                          เปลี่ยนรูป
                        </span>
                      </Button>
                    </label>
                    <input
                      id="poster-upload-replace"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePosterChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ===== Card 2: ข้อมูลพื้นฐาน ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>📝 ข้อมูลพื้นฐาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อกิจกรรม *</Label>
                  <Input
                    id="name"
                    placeholder="เช่น กิจกรรมวันกีฬาสี 2025"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">ประเภทกิจกรรม</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volunteer">🤝 จิตอาสา</SelectItem>
                      <SelectItem value="academic">📚 วิชาการ</SelectItem>
                      <SelectItem value="sport">⚽ กีฬา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <Label htmlFor="objective">วัตถุประสงค์กิจกรรม</Label>
                <Input
                  id="objective"
                  placeholder="เช่น เพื่อส่งเสริมความสามัคคีและสุขภาพที่ดี"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Row 3 */}
              <div className="space-y-2">
                <Label htmlFor="detail">รายละเอียดกิจกรรม</Label>
                <textarea
                  id="detail"
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="อธิบายรายละเอียดกิจกรรม เช่น กำหนดการ กิจกรรมย่อย ฯลฯ"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== Card 3: วันที่และเวลา ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>📅 วันที่และเวลา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">วันเริ่มกิจกรรม</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">วันสิ้นสุดกิจกรรม</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-time">เวลาเริ่มต้น</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">เวลาสิ้นสุด</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== Card 4: สถานที่ ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-red-500" />
                สถานที่จัดกิจกรรม
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* เลือก Location */}
              <div className="space-y-2">
                <Label htmlFor="location">เลือกสถานที่ *</Label>
                <Select value={locationID?.toString()} onValueChange={(val) => setLocationID(Number(val))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="เลือกสถานที่จัดกิจกรรม" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationList.map((loc) => (
                      <SelectItem key={loc.ID} value={loc.ID.toString()}>
                        {loc.location_detail
                          ? `${loc.building} ${loc.room} | ${loc.location_detail}`
                          : `${loc.building} ${loc.room}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* ข้อมูลแผนที่ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Map className="size-5 text-blue-500" />
                  <span>ข้อมูลแผนที่ (ไม่บังคับ)</span>
                </div>

                {/* Google Maps URL */}
                <div className="space-y-2">
                  <Label htmlFor="map-url">ลิงก์ Google Maps</Label>
                  <Input
                    id="map-url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={mapURL}
                    onChange={(e) => setMapURL(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500">
                    💡 คัดลอกจาก Google Maps แล้ววางที่นี่
                  </p>
                </div>

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">ละติจูด (Latitude)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="13.736717"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">ลองจิจูด (Longitude)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="100.523186"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Place Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="place-image">URL รูปสถานที่</Label>
                  <Input
                    id="place-image"
                    type="url"
                    placeholder="https://example.com/place-image.jpg"
                    value={placeImageURL}
                    onChange={(e) => setPlaceImageURL(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500">
                    🖼️ ลิงก์รูปภาพสถานที่ (ถ้ามี)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== Card 5: รางวัล ===== */}
          <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-600" />
                รางวัล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward-first" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full">1</span>
                  รางวัลชนะเลิศ / อันดับ 1
                </Label>
                <Input
                  id="reward-first"
                  placeholder="เช่น ถ้วยรางวัล + เงินสด 10,000 บาท"
                  value={rewardFirst}
                  onChange={(e) => setRewardFirst(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-second" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-400 text-white text-xs font-bold rounded-full">2</span>
                  รางวัลรองชนะเลิศอันดับ 1 / อันดับ 2
                </Label>
                <Input
                  id="reward-second"
                  placeholder="เช่น เกียรติบัตร + เงินสด 5,000 บาท"
                  value={rewardSecond}
                  onChange={(e) => setRewardSecond(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-third" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-700 text-white text-xs font-bold rounded-full">3</span>
                  รางวัลรองชนะเลิศอันดับ 2 / อันดับ 3
                </Label>
                <Input
                  id="reward-third"
                  placeholder="เช่น เกียรติบัตร + เงินสด 3,000 บาท"
                  value={rewardThird}
                  onChange={(e) => setRewardThird(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== Card 6: ทีมและสวัสดิการ ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                จำนวนทีมและสวัสดิการ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="team-number">จำนวนทีมที่รับสมัคร</Label>
                <Input
                  id="team-number"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={teamNumber || ""}
                  onChange={(e) => setTeamNumber(Number(e.target.value))}
                  className="h-11"
                />
                <p className="text-xs text-slate-500">
                  ระบุจำนวนทีมที่ต้องการรับสมัคร (ถ้ามี) เช่น 10 ทีม, 20 ทีม
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welfare" className="flex items-center gap-2">
                  <Gift className="size-4 text-green-600" />
                  สวัสดิการ / สิทธิประโยชน์
                </Label>
                <textarea
                  id="welfare"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="เช่น &#10;- อาหารว่างและเครื่องดื่ม&#10;- เสื้อกิจกรรม&#10;- ประกันอุบัติเหตุ&#10;- ของที่ระลึก"
                  value={welfare}
                  onChange={(e) => setWelfare(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== Card 7: ไฟล์แนบเพิ่มเติม ===== */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle>📎 ไฟล์แนบเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="attachment">เอกสารแนบ (ถ้ามี)</Label>
                <div className="flex items-center gap-3">
                  <label htmlFor="attachment-upload" className="flex-shrink-0">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">
                        <UploadIcon className="size-4 mr-2" />
                        เลือกไฟล์
                      </span>
                    </Button>
                  </label>
                  {attachmentFile && (
                    <div className="flex-1 bg-slate-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-slate-700 truncate">
                        📄 {attachmentFile.name}
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="attachment-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== Buttons ===== */}
          <div className="flex justify-end gap-4 pt-6">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-8"
            >
              ยกเลิก
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  กำลังส่ง...
                </>
              ) : (
                "ส่งแบบฟอร์ม"
              )}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default PostActivitiesComplete;