package entity

import (
	"time"

	"gorm.io/gorm"
)

type ApprovalLog struct {
	gorm.Model
	Comment  string    `json:"comment"`
	Decision string    `gorm:"not null" json:"decision"`
	Date     time.Time `json:"date"`

	UserID uint `gorm:"not null" json:"user_id"`
	// User 		User 	`gorm:"foreignKey:UserID" json:"user"`
	Proposal_ActivityID uint `gorm:"not null" json:"proposal_activity_id"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
