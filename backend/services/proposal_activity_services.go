package services

import (
	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
	"log"
	"fmt"
)

type ProposalActivityService struct {
	db              *gorm.DB
	documentService *DocumentService
}

func NewProposalActivityService(db *gorm.DB) *ProposalActivityService {
	return &ProposalActivityService{
		db:              db,
		documentService: NewDocumentService(db),
	}
}

func (s *ProposalActivityService) CreateActivity(activity *entity.Proposal_Activity, posterBase64 string, userID uint) error {
	activity.UserID = userID
	activity.Status = "pending"
	
	// ✅ Log ข้อมูลที่ได้รับ
	log.Printf("📝 Creating activity: %s", activity.ActivityName)
	log.Printf("   Type: %s", activity.Type)
	log.Printf("   Reward First: %s", activity.RewardFirst)
	log.Printf("   Reward Second: %s", activity.RewardSecond)
	log.Printf("   Reward Third: %s", activity.RewardThird)
	log.Printf("   Team Number: %d", activity.TeamNumber)
	log.Printf("   Welfare: %s", activity.Welfare)
	log.Printf("   Location ID: %v", activity.LocationID)
	
	if activity.Status == "" {
		activity.Status = "open"
	}
	
	// ✅ บันทึก Activity พร้อมฟิลด์ใหม่
	if err := s.db.Create(activity).Error; err != nil {
		log.Printf("❌ Failed to create activity: %v", err)
		return err
	}
	
	log.Printf("✅ Activity created with ID: %d", activity.ID)
	
	// ✅ บันทึกรูปภาพ (ถ้ามี)
	if posterBase64 != "" {
		log.Printf("🖼️ Saving poster image...")
		_, err := s.documentService.SaveImageWithDetail(
			"poster.jpg",
			"โปสเตอร์",
			posterBase64,
			activity.ID,
		)
		if err != nil {
			log.Printf("⚠️ Warning: Failed to save poster: %v", err)
			// ไม่ return error เพราะกิจกรรมสร้างสำเร็จแล้ว
		} else {
			log.Printf("✅ Poster saved successfully")
		}
	}
	
	return nil
}

func (s *ProposalActivityService) CreateActivityByID(activity *entity.Proposal_Activity, id uint, posterBase64 string, userID uint) error {
	activity.ID = id
	activity.UserID = userID
	activity.Status = "pending"

	log.Printf("📝 Creating activity by ID: %s by user ID: %d (Status: pending)", 
		activity.ActivityName, userID)
	log.Printf("   Type: %s", activity.Type)
	log.Printf("   Reward First: %s", activity.RewardFirst)
	log.Printf("   Reward Second: %s", activity.RewardSecond)
	log.Printf("   Reward Third: %s", activity.RewardThird)
	log.Printf("   Team Number: %d", activity.TeamNumber)
	log.Printf("   Welfare: %s", activity.Welfare)

	if activity.Status == "" {
		activity.Status = "open"
	}
	
	// ✅ บันทึก Activity
	if err := s.db.Create(activity).Error; err != nil {
		log.Printf("❌ Failed to create activity: %v", err)
		return err
	}

	log.Printf("✅ Activity created with ID: %d", activity.ID)

	// ✅ บันทึกรูปภาพ (ถ้ามี)
	if posterBase64 != "" {
		fileName := activity.ActivityName + "_poster.jpg"
		detail := "โปสเตอร์กิจกรรม"
		
		_, err := s.documentService.SaveImageWithDetail(
			fileName,
			detail,
			posterBase64,
			activity.ID,
		)
		if err != nil {
			log.Printf("⚠️ Warning: Failed to save poster: %v", err)
		} else {
			log.Printf("✅ Poster saved successfully")
		}
	}

	return nil
}

func (s *ProposalActivityService) GetAllActivities() ([]entity.Proposal_Activity, error) {
	var activities []entity.Proposal_Activity
	err := s.db.
		Preload("Location").
		Preload("Documents").
		Preload("User").
		Preload("Posts").
		Preload("Registrations").
		Order("created_at DESC").
		Find(&activities).Error

	if err != nil {
		log.Printf("❌ Failed to get activities: %v", err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d activities", len(activities))
	return activities, err
}

func (s *ProposalActivityService) GetActivityByID(id uint) (*entity.Proposal_Activity, error) {
	var activity entity.Proposal_Activity
	err := s.db.
		Preload("Location").
		Preload("Documents").
		Preload("User").
		Preload("Posts").
		Preload("Registrations").    
		Preload("Registrations.Users").
		First(&activity, id).Error
	
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("❌ Activity not found: ID %d", id)
		} else {
			log.Printf("❌ Failed to get activity: %v", err)
		}
		return nil, err
	}
	
	log.Printf("✅ Retrieved activity: %s (ID: %d)", activity.ActivityName, activity.ID)
	return &activity, nil
}

func (s *ProposalActivityService) GetActivitiesByUserID(userID uint) ([]entity.Proposal_Activity, error) {
	var activities []entity.Proposal_Activity
	err := s.db.
		Where("user_id = ?", userID).
		Preload("Location").
		Preload("Documents").
		Preload("User").
		Order("created_at DESC").
		Find(&activities).Error

	if err != nil {
		log.Printf("❌ Failed to get activities for user %d: %v", userID, err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d activities for user %d", len(activities), userID)
	return activities, err
}

// ✅ ดึงกิจกรรมตามสถานะ
func (s *ProposalActivityService) GetActivitiesByStatus(status string) ([]entity.Proposal_Activity, error) {
	var activities []entity.Proposal_Activity
	err := s.db.Where("status = ?", status).
		Preload("Location").
		Preload("User").
		Preload("Documents").
		Order("created_at DESC").
		Find(&activities).Error
	
	if err != nil {
		log.Printf("❌ Failed to get activities with status %s: %v", status, err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d activities with status: %s", len(activities), status)
	return activities, err
}

// ✅ อัพเดตสถานะกิจกรรม
func (s *ProposalActivityService) UpdateActivityStatus(id uint, status string, reason string) error {
    var activity entity.Proposal_Activity

    if err := s.db.First(&activity, id).Error; err != nil {
        log.Printf("❌ Activity not found: ID %d", id)
        return err
    }

    if activity.ID == 0 {
        return fmt.Errorf("activity not found")
    }

    log.Printf("📝 Updating activity %d status: %s -> %s", id, activity.Status, status)

    // อัปเดตเฉพาะ status
    updates := map[string]interface{}{
        "status": status,
    }

    err := s.db.Model(&activity).Updates(updates).Error
    
    if err != nil {
        log.Printf("❌ Failed to update status: %v", err)
        return err
    }

    log.Printf("✅ Activity status updated successfully")
    return nil
}