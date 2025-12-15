package entity

import "gorm.io/gorm"

type Location struct {
	gorm.Model

	Building string `json:"building"`
	Room     string `json:"room"`
	Detail   string `json:"detail"`
	PlaceImageURL string `json:"place_image_url"` // URL รูปสถานที่
	
	MapURL    string   `json:"map_url"`     // ลิงก์ Google Maps
    Latitude  *float64 `json:"latitude"`    // optional
    Longitude *float64 `json:"longitude"`   // optional
}