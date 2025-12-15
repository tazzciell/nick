package entity

import (
	"time"

	"gorm.io/gorm"
)

type Certificate struct {
	gorm.Model
	TitleTH       string    `gorm:"not null" json:"title_th"`
	TitleEN       string    `json:"title_en"`
	Detail        string    `json:"detail"`
	Organizer     string    `json:"organizer"`
	PictureURL    string    `json:"picture_url"`
	Signature1URL string    `json:"signature_1_url"`
	Signature2URL string    `json:"signature_2_url"`
	Date          time.Time `json:"date"`
	Type          string    `gorm:"not null" json:"type"`

	// Foreign keys
	UserID         uint   `gorm:"not null" json:"user_id"`
	ResultID       string `gorm:";not null" json:"result_id"`
	RegistrationID uint   `gorm:"not null" json:"registration_id"`
}
