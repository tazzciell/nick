package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type ApprovalLogController struct {
	service *services.ApprovalLogService
}

func NewApprovalLogController(service *services.ApprovalLogService) *ApprovalLogController {
	return &ApprovalLogController{service: service}
}

// POST /api/approval-logs
func (c *ApprovalLogController) Create(ctx *gin.Context) {
	var log entity.ApprovalLog

	if err := ctx.ShouldBindJSON(&log); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// user จาก JWT
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	log.UserID = userID.(uint)

	result, err := c.service.Create(&log)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Approval log created",
		"data":    result,
	})
}

// GET /api/approval-logs/activity/:id
func (c *ApprovalLogController) GetByActivityID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid activity id"})
		return
	}

	logs, err := c.service.GetByActivityID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":  logs,
		"total": len(logs),
	})
}

// DELETE /api/approval-logs/:id
func (c *ApprovalLogController) Delete(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := c.service.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "approval log deleted"})
}
