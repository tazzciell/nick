package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/controller"
	"github.com/sut68/team21/services"
)

func ApprovalLogRoutes(rg *gin.RouterGroup) {

	service := services.NewApprovalLogService(config.DB)
	controller := controller.NewApprovalLogController(service)

	log := rg.Group("/approval-logs")
	{
		log.POST("/", controller.Create)
		log.GET("/activity/:id", controller.GetByActivityID)
		log.DELETE("/:id", controller.Delete)
	}
}
