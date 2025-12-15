package entity

import (
	"gorm.io/gorm"
	"time"
)

type Document struct {
	gorm.Model
	FileName 	string   `json:"file_name"`
	FileType    string    `json:"file_type"`
    FilePath    string    `json:"file_path"`
    UploadDate  time.Time `json:"upload_date"`
    Detail      string    `json:"detail"`
    Poster      string    `json:"poster"`

	LocationID *uint

	ProposalActivityID *uint              `json:"proposal_activity_id"`
	Activity           *Proposal_Activity `gorm:"foreignKey:ProposalActivityID"`
}