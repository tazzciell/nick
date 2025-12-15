package entity

import (
	"gorm.io/gorm"
)

type Result struct {
	gorm.Model
	AwardID       string  `gorm:"not null" json:"award_id"`
	RegistrationID string  `gorm:"not null" json:"registration_id"`

	Certificates	[]*Certificate `gorm:"foreignKey:ResultID" json:"certificates"`
}