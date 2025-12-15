package services

import (
	"errors"
	"log"
	"time"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type DocumentService struct {
	db *gorm.DB
}

func NewDocumentService(db *gorm.DB) *DocumentService {
	return &DocumentService{db: db}
}

// ✅ บันทึก Base64 ตรงๆ ใน database (ไม่บันทึกเป็นไฟล์)
func (s *DocumentService) SaveImageWithDetail(
	fileName, detail, posterBase64 string,
	proposalActivityID uint,
) (*entity.Document, error) {
	// Validation
	if proposalActivityID == 0 {
		log.Printf("❌ Invalid proposal activity ID: 0")
		return nil, errors.New("proposal activity ID cannot be 0")
	}

	if posterBase64 == "" {
		log.Printf("❌ Empty base64 string")
		return nil, errors.New("poster base64 is required")
	}

	log.Printf("📤 SaveImageWithDetail: ProposalActivityID=%d", proposalActivityID)
	log.Printf("📊 Base64 length: %d characters", len(posterBase64))

	// ✅ สร้าง pointer
	activityIDPtr := proposalActivityID

	// ✅ บันทึก Base64 ตรงๆ ใน FilePath
	document := &entity.Document{
		FileName:           fileName,
		Detail:             detail,
		FilePath:           posterBase64, // ✅ เก็บ Base64 ตรงนี้
		Poster:             "",
		UploadDate:         time.Now(),
		ProposalActivityID: &activityIDPtr,
	}

	log.Printf("📋 Inserting document with Base64 data")

	if err := s.db.Create(document).Error; err != nil {
		log.Printf("❌ Database insert failed: %v", err)
		return nil, err
	}

	log.Printf("✅ Document saved with ID: %d", document.ID)
	return document, nil
}

// ✅ ดึงรูปภาพ (ไม่ต้องอ่านไฟล์ เพราะเก็บ Base64 แล้ว)
func (s *DocumentService) GetImagesByActivityID(proposalActivityID uint) ([]string, error) {
	var documents []entity.Document

	err := s.db.Where("proposal_activity_id = ?", proposalActivityID).Find(&documents).Error
	if err != nil {
		return nil, err
	}

	log.Printf("📸 Found %d images for Activity ID %d", len(documents), proposalActivityID)

	images := make([]string, 0, len(documents))
	for _, doc := range documents {
		// ✅ ส่ง Base64 กลับไปตรงๆ (ไม่ต้อง decode/encode)
		if doc.FilePath != "" {
			images = append(images, doc.FilePath)
		}
	}

	return images, nil
}

// ✅ ดึงรูปภาพเดียว
func (s *DocumentService) GetImageByID(documentID uint) (string, error) {
	var document entity.Document

	err := s.db.First(&document, documentID).Error
	if err != nil {
		return "", err
	}

	// ✅ ส่ง Base64 กลับไป
	return document.FilePath, nil
}

// ✅ ลบรูปภาพ (ไม่ต้องลบไฟล์ เพราะไม่มีไฟล์)
func (s *DocumentService) DeleteImage(documentID uint) error {
	var document entity.Document

	err := s.db.First(&document, documentID).Error
	if err != nil {
		return err
	}

	// ✅ ลบ record (ไม่ต้องลบไฟล์)
	return s.db.Delete(&document).Error
}

// ✅ Update รูปภาพ
func (s *DocumentService) UpdateImage(documentID uint, newBase64 string) error {
	if newBase64 == "" {
		return errors.New("base64 cannot be empty")
	}

	return s.db.Model(&entity.Document{}).
		Where("id = ?", documentID).
		Update("file_path", newBase64).Error
}

// CreateDocument สร้าง Document ใหม่
func (s *DocumentService) CreateDocument(document *entity.Document) error {
	document.UploadDate = time.Now()
	return s.db.Create(document).Error
}

// GetDocumentByID ดึง Document ตาม ID
func (s *DocumentService) GetDocumentByID(id uint) (*entity.Document, error) {
	var document entity.Document
	err := s.db.First(&document, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("document not found")
		}
		return nil, err
	}
	return &document, nil
}

