package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
	"github.com/sut68/team21/middleware"
	"github.com/sut68/team21/routes"
)

func main() {

	config.LoadEnv()
	config.ConnectDatabase()

	r := gin.Default()
	r.Static("/upload", "./upload")

	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	{
		routes.AuthRoutes(api)
		routes.UserRoutes(api)
		routes.MetadataRoutes(api)
		routes.Proposal_ActivityRoutes(api)
		routes.LocationRoutes(api)
		routes.DocumentRoutes(api)
		routes.PortfolioRoutes(api)
		routes.RegistrationRoutes(api)
		routes.PostRoutes(api)
	}

	fmt.Println(" Server running on port:", config.Env.BackendPort)
	r.Run(":" + config.Env.BackendPort)
}
