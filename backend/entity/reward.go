package entity

import (
	"gorm.io/gorm"
	"time"
)

type Reward struct {
	gorm.Model
	RewardName 	string 	`gorm:"not null" json:"reward_name"`
	PointRequired 	int 	`gorm:"not null" json:"point_required"`
	Stock 			int 	`gorm:"not null" json:"stock"`
	Description 	string 	`json:"description"`
	CreatedAt 	time.Time `json:"created_at"`
	UpdatedAt 	time.Time `json:"updated_at"`
	DeletedAt 	gorm.DeletedAt `gorm:"index" json:"-"`
	RewardRedeem *RewardRedeem `gorm:"foreignKey:RewardID" json:"reward_redeem,omitempty"`
}