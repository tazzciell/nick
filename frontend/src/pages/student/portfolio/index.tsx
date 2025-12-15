import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FolderOpen, AlertCircle } from "lucide-react";

// Services & Interfaces
import { GetPortfoliosByUserId, formatBase64ToDataURL } from "@/services/portfolioService";
import type { PortfolioInterface } from "../../../interfaces/portfolio";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function PortfolioList() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ⚠️ Hardcode UserID = 1 (ของจริงดึงจาก Context/Token)
  const currentUserId = 1;

 const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await GetPortfoliosByUserId(currentUserId);
      
      // ✅ 1. เพิ่ม Console Log เพื่อดูว่า Backend ส่งอะไรมากันแน่ (กด F12 ดูได้เลย)
      console.log("Full API Response:", res); 

      if (res.status === 200) {
        // ✅ 2. เช็คที่ res.data.data ก่อน (รูปแบบมาตรฐานของ Gin ที่เราเขียน)
        if (res.data && Array.isArray(res.data.data)) {
           console.log("Found data in res.data.data");
           setPortfolios(res.data.data);
        } 
        // ✅ 3. เช็คที่ res.data เผื่อ Backend ส่ง Array มาตรงๆ
        else if (Array.isArray(res.data)) {
           console.log("Found data in res.data");
           setPortfolios(res.data);
        }
        else {
           console.warn("Data format is incorrect", res.data);
        }
      } else {
        console.error("Error fetching portfolios:", res);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Filter Search
  const filteredPortfolios = portfolios.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper สำหรับเลือกสี Badge สถานะ
  const getStatusColor = (statusName?: string) => {
    switch (statusName?.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Pending
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="size-6 text-slate-700" />
              คลังผลงานของฉัน
            </h1>
            <Button 
              onClick={() => navigate("/student/portfolio/create")}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6"
            >
              <Plus className="size-4 mr-2" /> สร้างผลงานใหม่
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="ค้นหาชื่อผลงาน..." 
              className="pl-10 rounded-full border-slate-200 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500">
            ทั้งหมด {filteredPortfolios.length} รายการ
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400">
            <span className="loader mr-2"></span> กำลังโหลดข้อมูล...
          </div>
        ) : filteredPortfolios.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <FolderOpen className="size-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">ยังไม่มีผลงาน</h3>
            <p className="text-slate-500 mb-4">เริ่มต้นสร้าง Portfolio ชิ้นแรกของคุณได้เลย</p>
            <Button variant="outline" onClick={() => navigate("/student/portfolio/create")}>
              สร้างผลงานใหม่
            </Button>
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((item) => (
              <Card 
                key={item.ID}
                onClick={() => navigate(`/student/portfolio/${item.ID}`)}
                className="group cursor-pointer overflow-hidden border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                {/* Image Cover */}
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  {item.file_urls ? (
                    <img 
                      src={formatBase64ToDataURL(item.file_urls)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <FolderOpen className="size-10 opacity-50" />
                    </div>
                  )}
                  
                  {/* Status Badge (Overlay) */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md ${getStatusColor(item.portfolio_status?.status_name)}`}>
                    {item.portfolio_status?.status_name || "Unknown"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
                    {item.porttype || "General"}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 h-10 mb-4">
                    {item.description}
                  </p>
                  
                  {/* Footer Card */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                     <span className="text-xs text-slate-400">
                        คลิกเพื่อดูรายละเอียด
                     </span>
                     {/* ถ้า Admin มีคอมเมนต์แจ้งแก้ จะโชว์ไอคอนเตือน */}
                     {item.admin_comment && (
                        <div className="flex items-center text-xs text-orange-600 font-medium">
                           <AlertCircle className="size-3 mr-1" />
                           มีความเห็นจาก Admin
                        </div>
                     )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PortfolioList;