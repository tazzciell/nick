package entity

import (
	"gorm.io/gorm"
	"time"
)

type Registration struct {
	gorm.Model
	TeamName      string         `json:"team_name"`
	Description   string         `json:"description"`
	Status			string       `json:"status"`
	RegistrationDate time.Time      `json:"registration_date"`
	PostID		*uint           `gorm:"not null" json:"post_id"`
	Users	  []*User         `gorm:"many2many:user_registrations;" json:"users"`
	Results    []*Result       `gorm:"foreignKey:RegistrationID" json:"results"`
	PointRecords []*PointRecord `gorm:"foreignKey:RegistrationID" json:"point_records"`
	Certificates  []*Certificate `gorm:"foreignKey:RegistrationID" json:"certificates"`
	ActivityEvaluationRespones []*ActivityEvaluationRespone `gorm:"foreignKey:RegistrationID" json:"activity_evaluation_responses"`
	ProposalActivityID uint               `json:"proposal_activity_id" gorm:"not null"`
	ProposalActivity   *Proposal_Activity `gorm:"foreignKey:ProposalActivityID;constraint:OnDelete:CASCADE" json:"proposal_activity,omitempty"`
}