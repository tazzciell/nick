package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/controller"
	"github.com/sut68/team21/middleware"
	"github.com/sut68/team21/services"
)

func RegistrationRoutes(r *gin.RouterGroup) {
	registrationService := services.NewRegistrationService(config.DB)
	registrationController := controller.NewRegistrationController(registrationService)

	route := r.Group("/registrations")
	{
		// 🔐 Protected
		route.POST("", middleware.AuthMiddleware(), registrationController.CreateRegistration)
		route.GET("/my", middleware.AuthMiddleware(), registrationController.GetMyRegistrations)
		route.PUT("/:id/status", middleware.AuthMiddleware(), registrationController.UpdateRegistrationStatus)
		route.DELETE("/:id", middleware.AuthMiddleware(), registrationController.DeleteRegistration)
		route.POST("/:id/users", middleware.AuthMiddleware(), registrationController.AddUserToRegistration)
		route.DELETE("/:id/users", middleware.AuthMiddleware(), registrationController.RemoveUserFromRegistration)

		// 🌐 Public
		route.GET("/activity/:activity_id", registrationController.GetRegistrationsByActivityID)
		route.GET("/:id", registrationController.GetRegistrationByID)
	}
}
