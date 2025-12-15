package services

import (
	"log"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type LocationService struct {
	db *gorm.DB
}

func NewLocationService(db *gorm.DB) *LocationService {
	return &LocationService{db: db}
}

// GetAllLocations - ดึง Locations ทั้งหมด
func (s *LocationService) GetAllLocations() ([]entity.Location, error) {
	var locations []entity.Location
	err := s.db.Order("building ASC, room ASC").Find(&locations).Error
	
	if err != nil {
		log.Printf("❌ Failed to get locations: %v", err)
		return nil, err
	}

	log.Printf("✅ Retrieved %d locations", len(locations))
	return locations, err
}

// GetLocationByID - ดึง Location ตาม ID
func (s *LocationService) GetLocationByID(id uint) (*entity.Location, error) {
	var location entity.Location
	err := s.db.First(&location, id).Error
	
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("❌ Location not found: ID %d", id)
		} else {
			log.Printf("❌ Failed to get location: %v", err)
		}
		return nil, err
	}

	log.Printf("✅ Retrieved location: %s %s (ID: %d)", location.Building, location.Room, location.ID)
	return &location, nil
}

// CreateLocation - สร้าง Location ใหม่
func (s *LocationService) CreateLocation(location *entity.Location) error {
	log.Printf("📝 Creating location: %s %s", location.Building, location.Room)
	
	if location.MapURL != "" {
		log.Printf("   Map URL: %s", location.MapURL)
	}
	if location.Latitude != nil && location.Longitude != nil {
		log.Printf("   Coordinates: %.6f, %.6f", *location.Latitude, *location.Longitude)
	}

	err := s.db.Create(location).Error
	
	if err != nil {
		log.Printf("❌ Failed to create location: %v", err)
		return err
	}

	log.Printf("✅ Location created with ID: %d", location.ID)
	return nil
}

// UpdateLocation - อัปเดต Location
func (s *LocationService) UpdateLocation(id uint, location *entity.Location) error {
	// หา Location เดิม
	var existingLocation entity.Location
	if err := s.db.First(&existingLocation, id).Error; err != nil {
		log.Printf("❌ Location not found: ID %d", id)
		return err
	}

	log.Printf("📝 Updating location: %s %s (ID: %d)", existingLocation.Building, existingLocation.Room, id)

	// อัปเดตข้อมูล
	updates := map[string]interface{}{
		"building":        location.Building,
		"room":            location.Room,
		"detail":          location.Detail,
		"map_url":         location.MapURL,
		"latitude":        location.Latitude,
		"longitude":       location.Longitude,
		"place_image_url": location.PlaceImageURL,
	}

	// Log ข้อมูลที่อัปเดต
	if location.MapURL != "" {
		log.Printf("   Updating Map URL: %s", location.MapURL)
	}
	if location.Latitude != nil && location.Longitude != nil {
		log.Printf("   Updating Coordinates: %.6f, %.6f", *location.Latitude, *location.Longitude)
	}

	err := s.db.Model(&existingLocation).Updates(updates).Error
	
	if err != nil {
		log.Printf("❌ Failed to update location: %v", err)
		return err
	}

	log.Printf("✅ Location updated successfully")
	return nil
}

// DeleteLocation - ลบ Location (Soft Delete)
func (s *LocationService) DeleteLocation(id uint) error {
	// ตรวจสอบว่ามี Location หรือไม่
	var location entity.Location
	if err := s.db.First(&location, id).Error; err != nil {
		log.Printf("❌ Location not found: ID %d", id)
		return err
	}

	log.Printf("🗑️ Deleting location: %s %s (ID: %d)", location.Building, location.Room, id)

	// Soft Delete
	err := s.db.Delete(&entity.Location{}, id).Error
	
	if err != nil {
		log.Printf("❌ Failed to delete location: %v", err)
		return err
	}

	log.Printf("✅ Location deleted successfully")
	return nil
}