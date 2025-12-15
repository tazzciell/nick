package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type CertificateController struct {
	service *services.CertificateService
}

func NewCertificateController(service *services.CertificateService) *CertificateController {
	return &CertificateController{service: service}
}

// POST /api/certificates
func (c *CertificateController) Create(ctx *gin.Context) {
	var cert entity.Certificate

	if err := ctx.ShouldBindJSON(&cert); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	cert.UserID = userID.(uint)

	result, err := c.service.Create(&cert)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "certificate created",
		"data":    result,
	})
}

// GET /api/certificates/my
func (c *CertificateController) GetMyCertificates(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	certs, err := c.service.GetByUserID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":  certs,
		"total": len(certs),
	})
}

// GET /api/certificates/:id
func (c *CertificateController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	cert, err := c.service.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	ctx.JSON(http.StatusOK, cert)
}

// DELETE /api/certificates/:id
func (c *CertificateController) Delete(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := c.service.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "certificate deleted"})
}
