package entity

import (
	"gorm.io/gorm"
)

type HistoryActivity struct {
	gorm.Model
	StatusActivity string `gorm:"not null" json:"status_activity"`
	Proposal_Activities []*Proposal_Activity `gorm:"foreignKey:HistoryActivityID" json:"proposal_activities"`
}