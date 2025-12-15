package entity

import (
	"time"

	"gorm.io/gorm"
)
type Post struct {
	gorm.Model
	Title     string `gorm:"not null" json:"title"`
	Detail    string `gorm:"not null" json:"detail"`
	Status    string `gorm:"not null" json:"status"`
	Picture   string `json:"picture"`
	Type      string `gorm:"not null" json:"type"`
	Organizer string `gorm:"not null" json:"organizer"`

	StartDate time.Time `json:"start_date"`
	StopDate  time.Time `json:"stop_date"`
	Date      time.Time `json:"date"`

	UserID             *uint `gorm:"not null" json:"user_id"`
	User               *User `gorm:"foreignKey:UserID;constraint:-" json:"user"`
	ProposalActivityID uint  `gorm:"not null" json:"proposal_activity_id"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Chatroom                 *Chatroom                  `gorm:"foreignKey:PostID" json:"chatroom"`
	Registrations            []*Registration            `gorm:"foreignKey:PostID" json:"registrations"`
	ActivityEvaluationTopics []*ActivityEvaluationTopic `gorm:"foreignKey:PostID" json:"activity_evaluation_topics"`
}
