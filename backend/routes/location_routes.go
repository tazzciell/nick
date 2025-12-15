package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/sut68/team21/config"
    "github.com/sut68/team21/controller"
    "github.com/sut68/team21/services"
    "github.com/sut68/team21/middleware"
)

func LocationRoutes(r *gin.RouterGroup) {
    locationService := services.NewLocationService(config.DB)
    locationController := controller.NewLocationController(locationService)

    route := r.Group("/location")
    {
        // Public routes
        route.GET("/", locationController.GetAllLocations)
        route.GET("/:id", locationController.GetLocationByID)
        
        // ✅ Protected routes (ต้อง authentication)
        route.POST("/", middleware.AuthMiddleware(), locationController.CreateLocation)
        route.PUT("/:id", middleware.AuthMiddleware(), locationController.UpdateLocation)
        route.DELETE("/:id", middleware.AuthMiddleware(), locationController.DeleteLocation)
    }
}