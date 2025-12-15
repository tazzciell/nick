package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/controller"
	"github.com/sut68/team21/middleware"
	"github.com/sut68/team21/services"
)

func Proposal_ActivityRoutes(r *gin.RouterGroup) {

	activityService := services.NewProposalActivityService(config.DB)
	activityController := controller.NewActivityController(activityService)

	route := r.Group("/proposal_activities")
	{
		// ✅ Routes ที่ต้อง authentication
		route.POST("", middleware.AuthMiddleware(), activityController.CreateActivity)
		route.POST("/id:id", middleware.AuthMiddleware(), activityController.CreateActivityByID)
		route.GET("/my", middleware.AuthMiddleware(), activityController.GetMyActivities) // ✅ เพิ่ม middleware
		route.PUT("/:id/status", middleware.AuthMiddleware(), activityController.UpdateActivityStatus)
		route.GET("/:id/status",middleware.AuthMiddleware(), activityController.GetActivityStatus)
		
		// Routes ที่ไม่ต้อง authentication (public)
		route.GET("", activityController.GetAllActivities)
		route.GET("/:id", activityController.GetActivityByID)
		
	}
}