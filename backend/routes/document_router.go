package routes

import(
	"github.com/sut68/team21/controller"
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/services"
)

func DocumentRoutes(rg *gin.RouterGroup) {
	documentService := services.NewDocumentService(config.DB)
	documentController := controller.NewDocumentController(documentService)
	
	// ✅ แก้ path ให้ตรงกับที่ Frontend เรียก
	rg.POST("/images", documentController.SaveImageWithDetail)
	rg.GET("/images/:id", documentController.GetImageByID)
	rg.PUT("/images/:id", documentController.UpdateImage)
	rg.DELETE("/images/:id", documentController.DeleteImage)
	
	// ✅ Route สำหรับดึงรูปตาม Activity ID
	rg.GET("/activities/:id/images", documentController.GetImagesByActivityID)
	
	// Document routes (ถ้าต้องการ)
	rg.POST("/documents", documentController.CreateDocument)
	rg.GET("/documents/:id", documentController.GetDocumentByID)
}