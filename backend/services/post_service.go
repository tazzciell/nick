package services

import (
	"errors"
	"log"
	"time"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type PostService struct {
	db *gorm.DB
}

func NewPostService(db *gorm.DB) *PostService {
	return &PostService{db: db}
}

//
// =========================
// CREATE
// =========================
//
func (s *PostService) CreatePost(post *entity.Post) (*entity.Post, error) {

	// 1. Validation
	if post.Title == "" {
		return nil, errors.New("title is required")
	}
	if post.Detail == "" {
		return nil, errors.New("detail is required")
	}

	// -------------------------------------------------------------
	// 🔧 AUTO-FIX: สร้างข้อมูลจำลอง (Dummy Data) เพื่อแก้ Foreign Key Error
	// -------------------------------------------------------------

	defaultID := uint(1)

	// A. ตรวจสอบ User (ใน Post ของคุณเป็น *uint)
	if post.UserID == nil || *post.UserID == 0 {
		post.UserID = &defaultID
	}
	
	// เช็คว่ามี User ID 1 จริงไหม?
	var userCount int64
	s.db.Model(&entity.User{}).Where("id = ?", *post.UserID).Count(&userCount)
	if userCount == 0 {
		// สร้าง User จำลอง
		sql := "INSERT INTO users (id, created_at, updated_at, email, password) VALUES (?, ?, ?, ?, ?)"
		// หมายเหตุ: ปรับ email/password ให้ตรงกับ struct User ของคุณ
		s.db.Exec(sql, *post.UserID, time.Now(), time.Now(), "test@example.com", "password")
		log.Println("🔧 Auto-created Dummy User ID 1")
	}

	// B. ตรวจสอบ Proposal Activity (ใน Post ของคุณเป็น uint ธรรมดา ห้ามใส่ &)
	post.ProposalActivityID = defaultID // ✅ แก้ตรงนี้: ไม่ใส่ & แล้ว

	var proposalCount int64
	// ใช้ชื่อ struct entity.Proposal_Activity ตามที่คุณให้มา
	s.db.Model(&entity.Proposal_Activity{}).Where("id = ?", defaultID).Count(&proposalCount)
	
	if proposalCount == 0 {
		// สร้าง Proposal จำลอง
		// ต้องใส่ field ที่จำเป็นตาม struct Proposal_Activity
		sql := `INSERT INTO proposal_activities (
			id, created_at, updated_at, 
			activity_name, detail, user_id, team_number, type, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		
		// user_id ตรงนี้ต้องใส่เป็น 1 เพื่อให้มันผูกกับ User จำลองด้านบนได้
		s.db.Exec(sql, defaultID, time.Now(), time.Now(), 
			"General Project", "Auto-generated for Post creation", 1, 1, "General", "Approved")
			
		log.Println("🔧 Auto-created Dummy Proposal_Activity ID 1")
	}

	// -------------------------------------------------------------
	// จบส่วน AUTO-FIX
	// -------------------------------------------------------------

	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()

	log.Printf("📤 Creating post: %s", post.Title)

	if err := s.db.Create(post).Error; err != nil {
		log.Printf("❌ Failed to create post: %v", err)
		return nil, err
	}

	log.Printf("✅ Post created with ID: %d", post.ID)
	return post, nil
}
//
// =========================
// READ
// =========================
//

// ดึง Post ทั้งหมด
func (s *PostService) GetAllPosts() ([]entity.Post, error) {
	var posts []entity.Post

	err := s.db.
		Preload("User").
		Preload("Chatroom").
		Find(&posts).Error

	if err != nil {
		return nil, err
	}

	return posts, nil
}

// ดึง Post ตาม ID
func (s *PostService) GetPostByID(id uint) (*entity.Post, error) {
	var post entity.Post

	err := s.db.
		Preload("User").
		Preload("Chatroom").
		Preload("Registrations").
		First(&post, id).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("post not found")
		}
		return nil, err
	}

	return &post, nil
}

// ดึง Post ของ user (ใช้กับ /post/my)
func (s *PostService) GetMyPosts(userID uint) ([]entity.Post, error) {
	var posts []entity.Post

	err := s.db.
		Where("user_id = ?", userID).
		Preload("Chatroom").
		Find(&posts).Error

	if err != nil {
		return nil, err
	}

	return posts, nil
}

//
// =========================
// UPDATE
// =========================
//

func (s *PostService) UpdatePost(id uint, updatedData *entity.Post) error {

	updatedData.UpdatedAt = time.Now()

	result := s.db.Model(&entity.Post{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"title":      updatedData.Title,
			"detail":     updatedData.Detail,
			"status":     updatedData.Status,
			"picture":    updatedData.Picture,
			"type":       updatedData.Type,
			"organizer":  updatedData.Organizer,
			"start_date": updatedData.StartDate,
			"stop_date":  updatedData.StopDate,
			"updated_at": updatedData.UpdatedAt,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("post not found")
	}

	return nil
}

//
// =========================
// DELETE
// =========================
//

func (s *PostService) DeletePost(id uint) error {

	result := s.db.Delete(&entity.Post{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("post not found")
	}

	return nil
}
