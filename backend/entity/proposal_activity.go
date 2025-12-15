package entity

import (
	"time"

	"gorm.io/gorm"
)

type Proposal_Activity struct {
	gorm.Model
	ActivityName string    `json:"name"`
	Detail       string    `json:"detail"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	StartTime    time.Time `json:"start_time"`
	EndTime      time.Time `json:"end_time"`
	Type         string    `json:"type"`
	Objective    string    `json:"objective"`
	Status       string    `json:"status" gorm:"default:'pending'"`

	RewardFirst  string `json:"reward_first"`   // รางวัลที่ 1
    RewardSecond string `json:"reward_second"`  // รางวัลที่ 2
    RewardThird  string `json:"reward_third"`   // รางวัลที่ 3

	Welfare string `json:"welfare"` // สวัสดิการ เป็น text ยาว ๆ ได้
	TeamNumber uint `json:"team_number"`

	LocationID *uint     `json:"location_id"`
	Location   *Location `gorm:"foreignKey:LocationID" json:"location,omitempty"`
	
	// ผู้สร้างกิจกรรม (one-to-many)
	UserID uint  `json:"user_id"`
	User   *User `gorm:"foreignKey:UserID" json:"user,omitempty"`

	Registrations []Registration `gorm:"foreignKey:ProposalActivityID;constraint:OnDelete:CASCADE" json:"registrations,omitempty"`
	
	// ถ้าต้องการ many-to-many ให้ใช้ชื่อใหม่และตารางใหม่
	Participants []*User `gorm:"many2many:activity_participants;" json:"participants"`
	
	HistoryActivityID *uint `json:"history_activity_id"`

	Documents []Document `gorm:"foreignKey:Proposal_ActivityID" json:"documents"`
	Posts     []Post     `gorm:"foreignKey:Proposal_ActivityID" json:"posts"`
}