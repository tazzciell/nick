package services

import (
	"errors"
	"time"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type ApprovalLogService struct {
	db *gorm.DB
}

func NewApprovalLogService(db *gorm.DB) *ApprovalLogService {
	return &ApprovalLogService{db: db}
}

// CREATE
func (s *ApprovalLogService) Create(log *entity.ApprovalLog) (*entity.ApprovalLog, error) {

	if log.Decision == "" {
		return nil, errors.New("decision is required")
	}
	if log.UserID == 0 {
		return nil, errors.New("user_id is required")
	}
	if log.Proposal_ActivityID == 0 {
		return nil, errors.New("proposal_activity_id is required")
	}

	log.Date = time.Now()
	log.CreatedAt = time.Now()
	log.UpdatedAt = time.Now()

	if err := s.db.Create(log).Error; err != nil {
		return nil, err
	}

	return log, nil
}

// READ BY ACTIVITY
func (s *ApprovalLogService) GetByActivityID(activityID uint) ([]entity.ApprovalLog, error) {
	var logs []entity.ApprovalLog

	err := s.db.
		Where("proposal_activity_id = ?", activityID).
		Order("created_at DESC").
		Find(&logs).Error

	if err != nil {
		return nil, err
	}

	return logs, nil
}

// DELETE
func (s *ApprovalLogService) Delete(id uint) error {
	result := s.db.Delete(&entity.ApprovalLog{}, id)
	if result.RowsAffected == 0 {
		return errors.New("approval log not found")
	}
	return result.Error
}
