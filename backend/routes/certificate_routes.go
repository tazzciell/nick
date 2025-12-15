package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/controller"
	"github.com/sut68/team21/middleware"
	"github.com/sut68/team21/services"
)

func CertificateRoutes(rg *gin.RouterGroup) {

	service := services.NewCertificateService(config.DB)
	controller := controller.NewCertificateController(service)

	cert := rg.Group("/certificates")
	cert.Use(middleware.AuthMiddleware())
	{
		cert.POST("/", controller.Create)
		cert.GET("/my", controller.GetMyCertificates)
		cert.GET("/:id", controller.GetByID)
		cert.DELETE("/:id", controller.Delete)
	}
}
