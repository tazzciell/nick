package entity

import (
	"time"

	"gorm.io/gorm"
)

type PointRecord struct {
	gorm.Model
	UserID    uint           `gorm:"not null" json:"user_id"`
	Points    int            `gorm:"not null" json:"points"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	RegistrationID uint `gorm:"foreignKey" json:"registration_id"`
}
