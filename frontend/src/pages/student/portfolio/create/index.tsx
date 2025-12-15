import React, { useState } from "react";
import { ArrowLeft, Upload as UploadIcon, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Import Services และ Interfaces
import { CreatePortfolio as CreatePortfolioAPI, convertFileToBase64 } from "@/services/portfolioService";
import type { PortfolioInterface } from "../../../../interfaces/portfolio";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CreatePortfolio() {
  const navigate = useNavigate();

  // State Management
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Image State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // ฟังก์ชันจัดการรูปภาพ
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async () => {
    // 1. Validation
    if (!projectName.trim()) {
      alert("กรุณากรอกชื่อผลงาน");
      return;
    }
    if (!description.trim()) {
      alert("กรุณากรอกรายละเอียดผลงาน");
      return;
    }
    if (!projectType) {
        alert("กรุณาเลือกประเภทผลงาน");
        return;
    }

    setIsLoading(true);

    try {
      // 2. แปลงรูปเป็น Base64
      let coverBase64 = "";
      if (coverFile) {
        // ใช้ helper function ที่ import มาจาก service
        coverBase64 = await convertFileToBase64(coverFile);
      }

      // 3. เตรียม Payload สำหรับส่งไป API
      // หมายเหตุ: เนื่องจาก Controller ยังไม่ได้แก้ เราจะส่ง Base64 ไปใน field ที่ Backend รับได้
      // หาก Backend เป็นแบบเดิม (รับ file_urls string) มันจะบันทึก Base64 ยาวๆ ลงไปใน DB
      // ซึ่งใช้งานได้ แต่อาจจะไม่ใช่ Best Practice (ควรแก้ Controller ภายหลังให้รับ file_urls_base64 แยก)
      const payload: PortfolioInterface = {
          title: projectName.trim(),
          description: description.trim(),
          porttype: projectType,
          link_portfolio: projectLink,
          file_urls: coverBase64, // ส่ง Base64 ไปที่นี่ก่อน
          user_id: 1, // ⚠️ Hardcode ไว้ก่อน (ของจริงดึงจาก localStorage/Context)
          portfolio_status_id: 1,
          ID: undefined
      };

      console.log("📤 Sending Payload:", payload);

      // 4. เรียก API จริง
      const res = await CreatePortfolioAPI(payload);

      // ตรวจสอบ Response Status
      if (res.status === 201 || res.status === 200) {
        alert("🎉 สร้างผลงานสำเร็จ!");
        navigate("/student/portfolio"); // กลับไปหน้า List
      } else {
        // กรณี Error
        const errorMsg = res.data?.error || res.data?.message || "เกิดข้อผิดพลาดในการบันทึก";
        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-slate-100 rounded-full"
              >
                <ArrowLeft className="size-5 text-slate-700" />
              </Button>
              <h1 className="text-xl font-bold text-slate-900">สร้างผลงานใหม่</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">รายละเอียดผลงาน</h2>
          <p className="text-slate-600 mt-1">กรอกข้อมูลเพื่อนำเสนอผลงานของคุณใน Portfolio</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            
            {/* Upload Section */}
            <div className="mb-8">
              <Label className="text-base font-semibold text-slate-900">รูปปกผลงาน</Label>
              <div className="mt-3">
                {!coverPreview ? (
                  <>
                    <label
                      htmlFor="cover-upload"
                      className="group flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all duration-200"
                    >
                      <div className="p-4 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors mb-3">
                        <ImageIcon className="size-8 text-slate-500 group-hover:text-slate-900" />
                      </div>
                      <p className="text-slate-900 font-medium">อัปโหลดรูปปก</p>
                      <p className="text-xs text-slate-500 mt-1">
                        JPG, PNG, GIF (Max 5MB)
                      </p>
                    </label>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                  </>
                ) : (
                  <div className="relative w-full">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-sm"
                    />
                    
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow-lg border border-red-100 transition-all"
                      title="ลบรูปภาพ"
                    >
                      <X className="size-5" />
                    </button>

                    <div className="absolute bottom-4 right-4">
                        <label
                        htmlFor="cover-upload-replace"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-black text-white rounded-full cursor-pointer shadow-lg backdrop-blur-sm transition-all"
                        >
                        <UploadIcon className="size-4" />
                        <span className="text-sm font-medium">เปลี่ยนรูป</span>
                        </label>
                        <input
                        id="cover-upload-replace"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                        />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              
              {/* Row 1: Name & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">ชื่อผลงาน <span className="text-red-500">*</span></Label>
                  <Input
                    id="projectName"
                    placeholder="เช่น ออกแบบ UX/UI แอปพลิเคชัน"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">ประเภทผลงาน <span className="text-red-500">*</span></Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:ring-slate-900">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Coding / Development</SelectItem>
                      <SelectItem value="Business">Business / Marketing</SelectItem>
                      <SelectItem value="Other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Link */}
              <div className="space-y-2">
                 <Label htmlFor="projectLink">ลิงก์ผลงาน (ถ้ามี)</Label>
                 <div className="relative">
                    <LinkIcon className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input 
                        id="projectLink"
                        placeholder="https://github.com/..." 
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        className="h-11 rounded-xl border-slate-200 pl-10 focus:ring-slate-900"
                    />
                 </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด <span className="text-red-500">*</span></Label>
                <textarea
                  id="description"
                  rows={6}
                  className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all resize-none"
                  placeholder="อธิบายเกี่ยวกับผลงานของคุณ เครื่องมือที่ใช้ หรือสิ่งที่ได้เรียนรู้..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="rounded-xl px-6 h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              >
                ยกเลิก
              </Button>

              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-11 shadow-lg shadow-slate-900/20"
              >
                {isLoading ? "กำลังบันทึก..." : "ยืนยันการสร้าง"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default CreatePortfolio;