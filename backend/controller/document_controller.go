package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/entity"
	"github.com/sut68/team21/services"
)

type DocumentController struct {
	documentService *services.DocumentService
}

func NewDocumentController(documentService *services.DocumentService) *DocumentController {
	return &DocumentController{
		documentService: documentService,
	}
}

// POST /api/images
func (c *DocumentController) SaveImageWithDetail(ctx *gin.Context) {
	var req struct {
		FileName   string `json:"file_name"`
		Detail     string `json:"detail"`
		Poster     string `json:"poster"`
		Proposal_ActivityID uint   `json:"proposal_activityid"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	document, err := c.documentService.SaveImageWithDetail(req.FileName, req.Detail, req.Poster, req.Proposal_ActivityID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Image saved successfully",
		"data":    document,
	})
}

// GET /api/images/:id
func (c *DocumentController) GetImageByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	imageBase64, err := c.documentService.GetImageByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Image retrieved successfully",
		"data":    imageBase64,
	})
}

// GET /api/activities/:id/images
func (c *DocumentController) GetImagesByActivityID(ctx *gin.Context) {
	activityID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Activity ID"})
		return
	}

	images, err := c.documentService.GetImagesByActivityID(uint(activityID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Images retrieved successfully",
		"data":    images,
		"total":   len(images),
	})
}

// PUT /api/images/:id
func (c *DocumentController) UpdateImage(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req struct {
		Poster string `json:"poster"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = c.documentService.UpdateImage(uint(id), req.Poster)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Image updated successfully"})
}

// DELETE /api/images/:id
func (c *DocumentController) DeleteImage(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = c.documentService.DeleteImage(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

// POST /api/documents
func (c *DocumentController) CreateDocument(ctx *gin.Context) {
	var document entity.Document

	if err := ctx.ShouldBindJSON(&document); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.documentService.CreateDocument(&document)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Document created successfully",
		"data":    document,
	})
}

// GET /api/documents/:id
func (c *DocumentController) GetDocumentByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	document, err := c.documentService.GetDocumentByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Document retrieved successfully",
		"data":    document,
	})
}