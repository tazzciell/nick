import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Trash2, Edit, AlertTriangle, CheckCircle2 } from "lucide-react";

// Services & Interfaces
import { GetPortfolioById, DeletePortfolio, formatBase64ToDataURL } from "@/services/portfolioService";
import type { PortfolioInterface } from "@/interfaces/portfolio"; // แก้ path ให้ตรงกับโครงสร้างจริง

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 

function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioInterface | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await GetPortfolioById(Number(id));
        
        // ✅ Debug ดูโครงสร้างข้อมูล
        console.log("Detail Response:", res);

        if (res.status === 200) {
            // กรณี Backend ส่งมาแบบ { data: {ID: 1, ...} }
            if (res.data.data) {
                setPortfolio(res.data.data);
            } 
            // กรณี Backend ส่งมาแบบ { ID: 1, ... } ตรงๆ
            else if (res.data) {
                setPortfolio(res.data);
            } else {
                alert("ไม่พบข้อมูลผลงาน (Data format error)");
            }
        } else {
            console.error("Error resp:", res);
            alert("ไม่พบข้อมูลผลงาน หรือเกิดข้อผิดพลาด");
            navigate("/student/portfolio");
        }
      } catch (error) {
         console.error("Fetch Error:", error);
         alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      } finally {
         setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Delete Action
  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("คุณแน่ใจหรือไม่ที่จะลบผลงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้");
    if (confirm) {
      const res = await DeletePortfolio(Number(id));
      if (res.status === 200 || res.status === 204) {
        alert("ลบผลงานเรียบร้อยแล้ว");
        navigate("/student/portfolio");
      } else {
        const msg = res.data?.error || "เกิดข้อผิดพลาดในการลบ";
        alert(msg);
      }
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center h-screen text-slate-500">
        <span className="loader mr-2"></span> กำลังโหลด...
      </div>
  );
  
  if (!portfolio) return null;

  // Status Colors Helper
  const isApproved = portfolio.portfolio_status?.status_name === "Approved";
  const isRejected = portfolio.portfolio_status?.status_name === "Rejected";

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/student/portfolio")}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="size-4 mr-2" /> กลับหน้ารวม
            </Button>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={handleDelete}>
                <Trash2 className="size-4 mr-2" /> ลบ
              </Button>
              {/* ปุ่มแก้ไข: ถ้ายังไม่ได้ทำหน้า Edit ก็คอมเมนต์ไว้ก่อนได้ */}
              {/* <Button 
                variant="outline" 
                className="border-slate-300"
                onClick={() => navigate(`/student/portfolio/edit/${id}`)} 
              >
                <Edit className="size-4 mr-2" /> แก้ไข
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Admin Feedback Banner */}
        {(portfolio.admin_comment || isRejected) && (
           <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="size-5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                 <h4 className="font-semibold text-orange-900">ความคิดเห็นจากผู้ดูแลระบบ</h4>
                 <p className="text-orange-800 text-sm mt-1">
                    {portfolio.admin_comment || "ผลงานของคุณยังไม่ผ่านการอนุมัติ กรุณาตรวจสอบและแก้ไขข้อมูล"}
                 </p>
              </div>
           </div>
        )}

        {/* Success Banner */}
        {isApproved && (
           <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <span className="text-green-800 font-medium">ผลงานนี้ได้รับการอนุมัติแล้ว</span>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Image & Status */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                 <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center">
                    {portfolio.file_urls ? (
                      <img 
                        src={formatBase64ToDataURL(portfolio.file_urls)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 text-sm">No Image</div>
                    )}
                 </div>
              </Card>

              {/* Status Info */}
              <Card className="border-slate-200 shadow-sm p-4 bg-white">
                 <div className="text-sm font-medium text-slate-500 mb-2">สถานะปัจจุบัน</div>
                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border
                    ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 
                      isRejected ? 'bg-red-100 text-red-700 border-red-200' : 
                      'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                 >
                    {portfolio.portfolio_status?.status_name || "Unknown"}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>สร้างเมื่อ: {portfolio.CreatedAt ? new Date(portfolio.CreatedAt).toLocaleDateString('th-TH') : '-'}</span>
                 </div>
              </Card>
           </div>

           {/* Right Column: Content */}
           <div className="lg:col-span-2 space-y-6">
              <div>
                 <Badge variant="secondary" className="mb-3 px-3 py-1 text-sm bg-slate-200 text-slate-700 hover:bg-slate-300">
                    {portfolio.porttype || "General"}
                 </Badge>
                 <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                    {portfolio.title}
                 </h1>
              </div>

              {/* Description */}
              <div className="prose prose-slate max-w-none text-slate-600">
                 <p className="whitespace-pre-line leading-relaxed">
                    {portfolio.description}
                 </p>
              </div>

              {/* External Link */}
              {portfolio.link_portfolio && (
                 <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">ลิงก์ผลงานเพิ่มเติม</h3>
                    <a 
                      href={portfolio.link_portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                       <ExternalLink className="size-4" />
                       {portfolio.link_portfolio}
                    </a>
                 </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

export default PortfolioDetail;