package entity

import (
	"time"

	"gorm.io/gorm"
)

type RewardRedeem struct {
	gorm.Model
	UserID    uint           `gorm:"not null" json:"user_id"`
	RewardID  string         `gorm:";not null" json:"reward_id"`
	PointUsed int            `gorm:"not null" json:"point_used"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
