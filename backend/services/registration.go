package services

import (
	"fmt"
	"log"
	"time"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type RegistrationService struct {
	db *gorm.DB
}

func NewRegistrationService(db *gorm.DB) *RegistrationService {
	return &RegistrationService{
		db: db,
	}
}

// สร้าง Registration ใหม่
func (s *RegistrationService) CreateRegistration(registration *entity.Registration, userIDs []uint) error {
	// ตรวจสอบว่ากิจกรรมมีอยู่จริง
	var activity entity.Proposal_Activity
	if err := s.db.First(&activity, registration.ProposalActivityID).Error; err != nil {
		log.Printf("❌ Activity not found: ID %d", registration.ProposalActivityID)
		return fmt.Errorf("activity not found")
	}

	// ตรวจสอบสถานะกิจกรรม
	if activity.Status != "approved" {
		return fmt.Errorf("activity is not approved yet")
	}

	// ตั้งค่าเริ่มต้น
	registration.RegistrationDate = time.Now()
	registration.Status = "pending"

	// เริ่ม transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// บันทึก Registration
	if err := tx.Create(registration).Error; err != nil {
		tx.Rollback()
		log.Printf("❌ Failed to create registration: %v", err) // มีอยู่แล้ว
		return err
	}
	log.Printf("✅ Created registration row id=%d", registration.ID)
	
	if len(userIDs) > 0 {
		var users []*entity.User
		if err := tx.Find(&users, userIDs).Error; err != nil {
			tx.Rollback()
			log.Printf("❌ Failed to find users: %v", err)
			return err
		}
		log.Printf("✅ Found %d users for join", len(users))
	
		if err := tx.Model(registration).Association("Users").Append(users); err != nil {
			tx.Rollback()
			log.Printf("❌ Failed to append users: %v", err)
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("❌ Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("✅ Registration created: ID %d for Activity %d", registration.ID, registration.ProposalActivityID)
	return nil
}

// ✅ สร้าง Registration ด้วยรหัสนักศึกษา (SutIds)
func (s *RegistrationService) CreateRegistrationWithSutIds(registration *entity.Registration, sutIds []string) error {
	// ตรวจสอบว่ากิจกรรมมีอยู่จริง
	var activity entity.Proposal_Activity
	if err := s.db.First(&activity, registration.ProposalActivityID).Error; err != nil {
		log.Printf("❌ Activity not found: ID %d", registration.ProposalActivityID)
		return fmt.Errorf("activity not found")
	}

	// ตรวจสอบสถานะกิจกรรม
	if activity.Status != "approved" {
		return fmt.Errorf("activity is not approved yet")
	}

	// ค้นหา users จาก SutIds
	var users []*entity.User
	if err := s.db.Where("sut_id IN ?", sutIds).Find(&users).Error; err != nil {
		return fmt.Errorf("failed to find users: %v", err)
	}

	// ตรวจสอบว่าเจอครบหรือไม่
	if len(users) != len(sutIds) {
		foundIds := make(map[string]bool)
		for _, user := range users {
			foundIds[user.SutId] = true
		}
		
		var notFound []string
		for _, sutId := range sutIds {
			if !foundIds[sutId] {
				notFound = append(notFound, sutId)
			}
		}
		
		return fmt.Errorf("student IDs not found: %v", notFound)
	}

	// ตั้งค่าเริ่มต้น
	registration.RegistrationDate = time.Now()
	registration.Status = "pending"

	// เริ่ม transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// บันทึก Registration
	if err := tx.Create(registration).Error; err != nil {
		tx.Rollback()
		log.Printf("❌ Failed to create registration: %v", err)
		return err
	}

	// เพิ่มสมาชิกในทีม
	if len(users) > 0 {
		if err := tx.Model(registration).Association("Users").Append(users); err != nil {
			tx.Rollback()
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("❌ Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("✅ Registration created: ID %d for Activity %d with %d members", 
		registration.ID, registration.ProposalActivityID, len(users))
	return nil
}

// ดึง Registrations ทั้งหมดของกิจกรรม
func (s *RegistrationService) GetRegistrationsByActivityID(activityID uint) ([]entity.Registration, error) {
	var registrations []entity.Registration
	err := s.db.
		Where("proposal_activity_id = ?", activityID).
		Preload("Users").
		Preload("ProposalActivity").
		Order("created_at DESC").
		Find(&registrations).Error

	if err != nil {
		log.Printf("❌ Failed to get registrations for activity %d: %v", activityID, err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d registrations for activity %d", len(registrations), activityID)
	return registrations, nil
}

// ดึง Registration ด้วย ID
func (s *RegistrationService) GetRegistrationByID(id uint) (*entity.Registration, error) {
	var registration entity.Registration
	err := s.db.
		Preload("Users").
		Preload("ProposalActivity").
		Preload("Results").
		First(&registration, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("❌ Registration not found: ID %d", id)
		} else {
			log.Printf("❌ Failed to get registration: %v", err)
		}
		return nil, err
	}

	log.Printf("✅ Retrieved registration: ID %d", registration.ID)
	return &registration, nil
}

// ดึง Registrations ของ User
func (s *RegistrationService) GetRegistrationsByUserID(userID uint) ([]entity.Registration, error) {
	var registrations []entity.Registration
	err := s.db.
		Joins("JOIN user_registrations ON user_registrations.registration_id = registrations.id").
		Where("user_registrations.user_id = ?", userID).
		Preload("Users").
		Preload("ProposalActivity").
		Order("created_at DESC").
		Find(&registrations).Error

	if err != nil {
		log.Printf("❌ Failed to get registrations for user %d: %v", userID, err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d registrations for user %d", len(registrations), userID)
	return registrations, nil
}

// อัปเดตสถานะ Registration
func (s *RegistrationService) UpdateRegistrationStatus(id uint, status string) error {
	var registration entity.Registration
	if err := s.db.First(&registration, id).Error; err != nil {
		log.Printf("❌ Registration not found: ID %d", id)
		return err
	}

	log.Printf("📝 Updating registration %d status: %s -> %s", id, registration.Status, status)

	err := s.db.Model(&registration).Update("status", status).Error
	if err != nil {
		log.Printf("❌ Failed to update status: %v", err)
		return err
	}

	log.Printf("✅ Registration status updated successfully")
	return nil
}

// ลบ Registration
func (s *RegistrationService) DeleteRegistration(id uint) error {
	var registration entity.Registration
	if err := s.db.First(&registration, id).Error; err != nil {
		return err
	}

	if err := s.db.Delete(&registration).Error; err != nil {
		log.Printf("❌ Failed to delete registration: %v", err)
		return err
	}

	log.Printf("✅ Registration deleted: ID %d", id)
	return nil
}

// เพิ่มสมาชิกในทีม
func (s *RegistrationService) AddUserToRegistration(registrationID uint, userID uint) error {
	var registration entity.Registration
	if err := s.db.First(&registration, registrationID).Error; err != nil {
		return err
	}

	var user entity.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}

	if err := s.db.Model(&registration).Association("Users").Append(&user); err != nil {
		log.Printf("❌ Failed to add user to registration: %v", err)
		return err
	}

	log.Printf("✅ User %d added to registration %d", userID, registrationID)
	return nil
}

// ลบสมาชิกออกจากทีม
func (s *RegistrationService) RemoveUserFromRegistration(registrationID uint, userID uint) error {
	var registration entity.Registration
	if err := s.db.First(&registration, registrationID).Error; err != nil {
		return err
	}

	var user entity.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}

	if err := s.db.Model(&registration).Association("Users").Delete(&user); err != nil {
		log.Printf("❌ Failed to remove user from registration: %v", err)
		return err
	}

	log.Printf("✅ User %d removed from registration %d", userID, registrationID)
	return nil
}