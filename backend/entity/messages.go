package entity

import (
	"time"

	"gorm.io/gorm"
)

type Messages struct {
	gorm.Model
	Body           string         `json:"body"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	UserID         uint           `gorm:"not null" json:"user_id"`
	User           User           `gorm:"foreignKey:UserID" json:"user"`
	MessagesTypeID uint           `gorm:"not null" json:"messages_type_id"`
	MessagesType   *MessagesType  `gorm:"foreignKey:MessagesTypeID" json:"messages_type"`
	ChatRoomID     uint           `gorm:"not null" json:"chat_room_id"`
}
