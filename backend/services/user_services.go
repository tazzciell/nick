package services

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/sut68/team21/dto"
	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
	"log"
	"fmt"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		db: db,
	}
}

func (s *UserService) GetAllUsers() ([]entity.User, error) {
	var users []entity.User
	if err := s.db.Preload("Role").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserProfileBySutId(sutId string) (*entity.User, error) {
	var user entity.User
	if err := s.db.Preload("Faculty").
		Preload("Major").
		Preload("Role").
		Preload("Skills").
		Preload("Interests").
		Preload("Tools").
		Preload("Socials").
		Where("sut_id = ?", sutId).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil 
}

func (s *UserService) UpdateAvatarBySutId(sutId string, avatarURL string) error {
	var user entity.User
	if err := s.db.Where("sut_id = ?", sutId).First(&user).Error; err != nil {
		return err
	}

	if user.AvatarURL != "" && !isExternalURL(user.AvatarURL) && !strings.Contains(user.AvatarURL, "default-avatar") {
		oldFilePath := filepath.Join(user.AvatarURL)
		if _, err := os.Stat(oldFilePath); err == nil {
			_ = os.Remove(oldFilePath)
		}
	}

	result := s.db.Model(&entity.User{}).
		Where("sut_id = ?", sutId).
		Update("avatar_url", avatarURL)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (s *UserService) UpdateProfileBySutId(sutId string, req *dto.UpdateProfileRequest) error {
	var user entity.User
	if err := s.db.Where("sut_id = ?", sutId).First(&user).Error; err != nil {
		return err
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		// 1. Update Basic Info
		if err := tx.Model(&user).Updates(map[string]interface{}{
			"first_name": req.FirstName,
			"last_name":  req.LastName,
			"phone":      req.Phone,
			"faculty_id": req.FacultyID,
			"major_id":   req.MajorID,
			"year":       req.Year,
			"bio":        req.Bio,
		}).Error; err != nil {
			return err
		}

		if err := tx.Where("user_id = ?", user.ID).Delete(&entity.Skill{}).Error; err != nil {
			return err
		}
		if len(req.Skills) > 0 {
			var skills []entity.Skill
			for _, name := range req.Skills {
				if name != "" {
					skills = append(skills, entity.Skill{Name: name, UserID: user.ID})
				}
			}
			if len(skills) > 0 {
				if err := tx.Create(&skills).Error; err != nil {
					return err
				}
			}
		}

		if err := tx.Where("user_id = ?", user.ID).Delete(&entity.Interest{}).Error; err != nil {
			return err
		}
		if len(req.Interests) > 0 {
			var interests []entity.Interest
			for _, name := range req.Interests {
				if name != "" {
					interests = append(interests, entity.Interest{Name: name, UserID: user.ID})
				}
			}
			if len(interests) > 0 {
				if err := tx.Create(&interests).Error; err != nil {
					return err
				}
			}
		}

		if err := tx.Where("user_id = ?", user.ID).Delete(&entity.Tool{}).Error; err != nil {
			return err
		}
		if len(req.Tools) > 0 {
			var tools []entity.Tool
			for _, name := range req.Tools {
				if name != "" {
					tools = append(tools, entity.Tool{Name: name, UserID: user.ID})
				}
			}
			if len(tools) > 0 {
				if err := tx.Create(&tools).Error; err != nil {
					return err
				}
			}
		}

		if err := tx.Where("user_id = ?", user.ID).Delete(&entity.Social{}).Error; err != nil {
			return err
		}
		if len(req.Socials) > 0 {
			var socials []entity.Social
			for _, item := range req.Socials {
				if item.Platform != "" && item.URL != "" {
					socials = append(socials, entity.Social{
						Platform: item.Platform,
						Link:     item.URL,
						UserID:   user.ID,
					})
				}
			}
			if len(socials) > 0 {
				if err := tx.Create(&socials).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func isExternalURL(url string) bool {
	return len(url) > 7 && (url[:7] == "http://" || url[:8] == "https://")
}


// -----------------------------------------------------------------------------------------------------------------------------------------ของกายด้านล่าง//
// ✅ ดึงข้อมูล User ด้วยรหัสนักศึกษา (SutId) - รองรับทุกรูปแบบ
func (s *UserService) GetUserBySutId(sutId string) (*entity.User, error) {
	// ทำความสะอาด input
	cleanSutId := strings.TrimSpace(sutId)
	
	var user entity.User
	
	// ลองหาแบบตรงๆ ก่อน
	err := s.db.
		Preload("Faculty").
		Preload("Major").
		Preload("Role").
		Preload("UserPoint").
		Preload("Skills").
		Preload("Interests").
		Preload("Tools").
		Preload("Socials").
		Where("sut_id = ?", cleanSutId).
		First(&user).Error

	// ถ้าไม่เจอ ลองหาแบบไม่สนใจตัวพิมพ์เล็ก/ใหญ่
	if err == gorm.ErrRecordNotFound {
		err = s.db.
			Preload("Faculty").
			Preload("Major").
			Preload("Role").
			Preload("UserPoint").
			Preload("Skills").
			Preload("Interests").
			Preload("Tools").
			Preload("Socials").
			Where("LOWER(TRIM(sut_id)) = LOWER(?)", cleanSutId).
			First(&user).Error
	}

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("❌ User not found: SutId '%s'", sutId)
			// Log เพื่อ debug
			var count int64
			s.db.Model(&entity.User{}).Where("sut_id LIKE ?", "%"+cleanSutId+"%").Count(&count)
			log.Printf("📊 Found %d users with similar SutId", count)
			
			return nil, fmt.Errorf("student not found with SutId: %s", sutId)
		}
		log.Printf("❌ Failed to get user by SutId: %v", err)
		return nil, err
	}

	log.Printf("✅ Retrieved user by SutId: %s %s (SutId: %s)", user.FirstName, user.LastName, user.SutId)
	return &user, nil
}

// ✅ ค้นหานักศึกษาหลายคนด้วยรหัสนักศึกษา (รองรับตัวพิมพ์เล็ก/ใหญ่)
func (s *UserService) GetUsersBySutIds(sutIds []string) ([]*entity.User, []string, error) {
	// แปลงเป็นตัวพิมพ์เล็กทั้งหมด
	normalizedSutIds := make([]string, len(sutIds))
	for i, id := range sutIds {
		normalizedSutIds[i] = strings.ToLower(strings.TrimSpace(id))
	}

	var users []*entity.User
	err := s.db.
		Preload("Faculty").
		Preload("Major").
		Preload("Role").
		Where("LOWER(TRIM(sut_id)) IN ?", normalizedSutIds).
		Find(&users).Error

	if err != nil {
		log.Printf("❌ Failed to get users by SutIds: %v", err)
		return nil, nil, err
	}

	// ตรวจสอบว่ามีรหัสนักศึกษาไหนไม่เจอบ้าง
	foundIds := make(map[string]bool)
	for _, user := range users {
		foundIds[strings.ToLower(strings.TrimSpace(user.SutId))] = true
	}
	
	var notFound []string
	for _, sutId := range normalizedSutIds {
		if !foundIds[sutId] {
			notFound = append(notFound, sutId)
		}
	}
	
	if len(notFound) > 0 {
		log.Printf("⚠️ SutIds not found: %v", notFound)
	}

	log.Printf("✅ Retrieved %d users from %d SutIds", len(users), len(sutIds))
	return users, notFound, nil
}

// ✅ ค้นหานักศึกษาด้วยชื่อหรือรหัสนักศึกษา (สำหรับ autocomplete/search)
func (s *UserService) SearchUsers(query string) ([]*entity.User, error) {
	var users []*entity.User
	err := s.db.
		Preload("Faculty").
		Preload("Major").
		Preload("Role").
		Where("first_name LIKE ? OR last_name LIKE ? OR sut_id LIKE ?", 
			"%"+query+"%", "%"+query+"%", "%"+query+"%").
		Limit(20).
		Find(&users).Error

	if err != nil {
		log.Printf("❌ Failed to search users: %v", err)
		return nil, err
	}

	log.Printf("✅ Found %d users matching query: %s", len(users), query)
	return users, nil
}
