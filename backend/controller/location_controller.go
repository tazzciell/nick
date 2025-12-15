package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type LocationController struct {
	locationService *services.LocationService
}

func NewLocationController(service *services.LocationService) *LocationController {
	return &LocationController{
		locationService: service,
	}
}

// GET /api/location
func (c *LocationController) GetAllLocations(ctx *gin.Context) {
	locations, err := c.locationService.GetAllLocations()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, locations)
}

// GET /api/location/:id
func (c *LocationController) GetLocationByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	location, err := c.locationService.GetLocationByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	ctx.JSON(http.StatusOK, location)
}

// POST /api/location
func (c *LocationController) CreateLocation(ctx *gin.Context) {
	var location entity.Location

	if err := ctx.ShouldBindJSON(&location); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validation
	if location.Building == "" || location.Room == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Building and Room are required"})
		return
	}

	if err := c.locationService.CreateLocation(&location); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":  "Location created successfully",
		"location": location,
	})
}

// PUT /api/location/:id
func (c *LocationController) UpdateLocation(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req struct {
		Building      string   `json:"building"`
		Room          string   `json:"room"`
		Detail        string   `json:"detail"`
		MapURL        string   `json:"map_url"`
		Latitude      *float64 `json:"latitude"`
		Longitude     *float64 `json:"longitude"`
		PlaceImageURL string   `json:"place_image_url"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง Location object
	location := entity.Location{
		Building:      req.Building,
		Room:          req.Room,
		Detail:        req.Detail,
		MapURL:        req.MapURL,
		Latitude:      req.Latitude,
		Longitude:     req.Longitude,
		PlaceImageURL: req.PlaceImageURL,
	}

	if err := c.locationService.UpdateLocation(uint(id), &location); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Location updated successfully",
		"location": location,
	})
}

// DELETE /api/location/:id
func (c *LocationController) DeleteLocation(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.locationService.DeleteLocation(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Location deleted successfully",
	})
}