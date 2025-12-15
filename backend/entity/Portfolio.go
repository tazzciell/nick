package entity

import (
	"gorm.io/gorm"
)

type Portfolio struct {
	gorm.Model
	Title             string           `gorm:"unique" json:"title"`
	Description       string           `json:"description"`
	PortType          string           `json:"porttype"`
	LinkPortfolio     string           `json:"link_portfolio"`
	File_urls         string           `json:"file_urls"`
	UserID            uint             `gorm:"not null" json:"user_id"`
	AdminComment      *string          `json:"admin_comment"`
	PortfolioStatusID uint             `gorm:"not null" json:"portfolio_status_id"`
	PortfolioStatus   *PortfolioStatus `gorm:"foreignKey:PortfolioStatusID" json:"portfolio_status"`
}
