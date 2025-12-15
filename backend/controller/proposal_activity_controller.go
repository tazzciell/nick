package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type ActivityController struct {
	service *services.ProposalActivityService
}

func NewActivityController(service *services.ProposalActivityService) *ActivityController {
	return &ActivityController{
		service: service,
	}
}

type CreateActivityRequest struct {
    entity.Proposal_Activity
    PosterBase64 string `json:"poster_base64"`
    
    // ✅ เพิ่มฟิลด์แผนที่ (ถ้าต้องการแก้ Location พร้อมกับ Activity)
    MapURL        string   `json:"map_url"`
    Latitude      *float64 `json:"latitude"`
    Longitude     *float64 `json:"longitude"`
    PlaceImageURL string   `json:"place_image_url"`
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=approved rejected pending"`
	Reason string `json:"reason"` // เหตุผลในการปฏิเสธ (optional)
}

func (ac *ActivityController) CreateActivity(c *gin.Context) {
	var req CreateActivityRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	userID, exists := c.Get("user_id")
	var uid uint = 1
	
	if exists {
		var ok bool
		uid, ok = userID.(uint)
		if !ok {
			uid = 1
		}
	}
	
	// ✅ Log ข้อมูลที่ได้รับ (สำหรับ debug)
	c.Request.Header.Set("Content-Type", "application/json")
	
	// ตั้งสถานะเป็น pending เสมอเมื่อสร้างใหม่
	req.Proposal_Activity.Status = "pending"
	
	if err := ac.service.CreateActivity(&req.Proposal_Activity, req.PosterBase64, uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Activity created successfully and pending approval",
		"activity": req.Proposal_Activity,
	})
}

func (ac *ActivityController) CreateActivityByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req CreateActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	
	uid, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	req.Proposal_Activity.Status = "pending"

	if err := ac.service.CreateActivityByID(&req.Proposal_Activity, uint(id), req.PosterBase64, uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, req.Proposal_Activity)
}

func (ac *ActivityController) GetAllActivities(c *gin.Context) {
	// Query parameter สำหรับ filter status
	status := c.Query("status") // ?status=approved หรือ ?status=pending
	
	activities, err := ac.service.GetAllActivities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Filter by status if provided
	if status != "" {
		filtered := []entity.Proposal_Activity{}
		for _, activity := range activities {
			if activity.Status == status {
				filtered = append(filtered, activity)
			}
		}
		c.JSON(http.StatusOK, filtered)
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (ac *ActivityController) GetActivityByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	activity, err := ac.service.GetActivityByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
		return
	}

	c.JSON(http.StatusOK, activity)
}

func (ac *ActivityController) GetMyActivities(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	activities, err := ac.service.GetActivitiesByUserID(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (ac *ActivityController) GetActivityStatus(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid activity id"})
		return
	}

	activity, err := ac.service.GetActivityByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "activity not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":     activity.ID,
		"status": activity.Status,
	})
}

func (ac *ActivityController) UpdateActivityStatus(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.ParseUint(idParam, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid activity id"})
        return
    }

    var req UpdateStatusRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := ac.service.UpdateActivityStatus(uint(id), req.Status, req.Reason); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    activity, _ := ac.service.GetActivityByID(uint(id))

    c.JSON(http.StatusOK, gin.H{
        "message":  "Activity status updated",
        "status":   req.Status,
        "activity": activity,
    })
}