package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/controller"
	"github.com/sut68/team21/middleware"
	"github.com/sut68/team21/services"
)

func UserRoutes(r *gin.RouterGroup) {
	userService := services.NewUserService(config.DB)
	userController := controller.NewUserController(userService)

	// Public routes
	r.GET("/users", userController.GetAllUsers)
	r.POST("/upload/avatar", userController.UploadAvatar)

	profileRoutes := r.Group("/profiles")
	profileRoutes.GET("/:sutId", userController.GetUserProfile)
	profileRoutes.Use(middleware.AuthMiddleware())
	{
		profileRoutes.GET("/me", userController.GetMyProfile)
		profileRoutes.PUT("/me", userController.UpdateMyProfile)
	}

	userRoutes := r.Group("/users")
	userRoutes.Use(middleware.AuthMiddleware())
	{
		// ค้นหานักศึกษาด้วยชื่อหรือรหัส (autocomplete)
		userRoutes.GET("/search", userController.SearchUsers)
		
		// ดึงข้อมูลนักศึกษาด้วยรหัสนักศึกษา
		userRoutes.GET("/sut-id/:sutId", userController.GetUserBySutId)
		
		// ดึงข้อมูลนักศึกษาหลายคนพร้อมกัน (สำหรับเพิ่มสมาชิกในทีม)
		userRoutes.POST("/by-sut-ids", userController.GetUsersBySutIds)
	}
}
