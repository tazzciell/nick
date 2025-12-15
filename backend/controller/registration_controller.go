package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type RegistrationController struct {
	service *services.RegistrationService
}

func NewRegistrationController(service *services.RegistrationService) *RegistrationController {
	return &RegistrationController{
		service: service,
	}
}

type CreateRegistrationRequest struct {
	TeamName            string   `json:"team_name" binding:"required"`
	Description         string   `json:"description"`
	ProposalActivityID  uint     `json:"proposal_activity_id" binding:"required"`
	PostID              *uint    `json:"post_id"`
	UserIDs             []uint   `json:"user_ids"`  // รายชื่อสมาชิกในทีม (ใช้ User ID)
	SutIds              []string `json:"sut_ids"`   // ✅ หรือใช้รหัสนักศึกษา
}

type UpdateRegistrationStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending approved rejected"`
}

type AddUserRequest struct {
	UserID uint `json:"user_id" binding:"required"`
}

// สร้าง Registration ใหม่
func (rc *RegistrationController) CreateRegistration(c *gin.Context) {
	var req CreateRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึง user_id จาก middleware
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

	// เพิ่ม user ที่สร้างเข้าไปในทีมด้วย
	if len(req.UserIDs) == 0 {
		req.UserIDs = []uint{uid}
	} else {
		// ตรวจสอบว่า user ที่สร้างอยู่ในทีมหรือไม่
		found := false
		for _, id := range req.UserIDs {
			if id == uid {
				found = true
				break
			}
		}
		if !found {
			req.UserIDs = append(req.UserIDs, uid)
		}
	}

	registration := &entity.Registration{
		TeamName:           req.TeamName,
		Description:        req.Description,
		ProposalActivityID: req.ProposalActivityID,
		// PostID:             req.PostID,
	}

	if err := rc.service.CreateRegistration(registration, req.UserIDs); err != nil {
		if err.Error() == "activity is not approved yet" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "activity not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Registration created successfully",
		"registration": registration,
	})
}

// ดึง Registrations ทั้งหมดของกิจกรรม
func (rc *RegistrationController) GetRegistrationsByActivityID(c *gin.Context) {
	activityID, err := strconv.ParseUint(c.Param("activity_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid activity ID"})
		return
	}

	registrations, err := rc.service.GetRegistrationsByActivityID(uint(activityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, registrations)
}

// ดึง Registration ด้วย ID
func (rc *RegistrationController) GetRegistrationByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	registration, err := rc.service.GetRegistrationByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Registration not found"})
		return
	}

	c.JSON(http.StatusOK, registration)
}

// ดึง Registrations ของ User ที่ login
func (rc *RegistrationController) GetMyRegistrations(c *gin.Context) {
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

	registrations, err := rc.service.GetRegistrationsByUserID(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, registrations)
}

// อัปเดตสถานะ Registration (สำหรับ admin)
func (rc *RegistrationController) UpdateRegistrationStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req UpdateRegistrationStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := rc.service.UpdateRegistrationStatus(uint(id), req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	registration, _ := rc.service.GetRegistrationByID(uint(id))

	c.JSON(http.StatusOK, gin.H{
		"message":      "Registration status updated",
		"registration": registration,
	})
}

// ลบ Registration
func (rc *RegistrationController) DeleteRegistration(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := rc.service.DeleteRegistration(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration deleted successfully"})
}

// เพิ่มสมาชิกในทีม
func (rc *RegistrationController) AddUserToRegistration(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req AddUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := rc.service.AddUserToRegistration(uint(id), req.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User added to registration"})
}

// ลบสมาชิกออกจากทีม
func (rc *RegistrationController) RemoveUserFromRegistration(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req AddUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := rc.service.RemoveUserFromRegistration(uint(id), req.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User removed from registration"})
}