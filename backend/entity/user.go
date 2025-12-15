package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	SutId     string     `gorm:"unique" json:"sut_id"`
	Email     string     `gorm:"unique" json:"email"`
	Password  string     `gorm:"not null" json:"-"`
	FirstName string     `json:"first_name"` 
	LastName  string     `json:"last_name"`
	Phone     string     `json:"phone"`
	FacultyID uint       `json:"faculty_id"`
	Faculty   *Faculty   `gorm:"foreignKey:FacultyID;" json:"faculty"`
	MajorID   uint       `json:"major_id"`
	Major     *Major     `gorm:"foreignKey:MajorID;" json:"major"`
	Year      uint       `json:"year"`
	RoleID    uint       `json:"role_id"`
	Role      *Role      `gorm:"foreignKey:RoleID;" json:"role"`
	Bio       string     `json:"bio"`
	AvatarURL string     `json:"avatar_url"`
	UserPoint *UserPoint `gorm:"foreignKey:UserID" json:"user_point,omitempty"`

	RewardRedeems             []*RewardRedeem              `gorm:"foreignKey:UserID" json:"reward_redeems"`
	PointRecords              []*PointRecord               `gorm:"foreignKey:UserID" json:"point_records"`
	//Results                   []*Result                    `gorm:"foreignKey:UserID" json:"results"`
	Certificates              []*Certificate               `gorm:"foreignKey:UserID" json:"certificates"`
	Portfolios                []*Portfolio                 `gorm:"foreignKey:UserID" json:"portfolios"`

	Messages      []*Messages     `gorm:"foreignKey:UserID" json:"messages"`
	Proposal_Activitys []*Proposal_Activity `gorm:"foreignKey:UserID" json:"proposal_activities"`
	Posts              []*Post              `gorm:"foreignKey:UserID" json:"posts"`
	ApprovalLogs       []*ApprovalLog       `gorm:"foreignKey:UserID" json:"approval_logs"`
	Interests          []*Interest          `gorm:"foreignKey:UserID" json:"interests"`
	Skills             []*Skill             `gorm:"foreignKey:UserID" json:"skills"`
	Socials            []*Social            `gorm:"foreignKey:UserID" json:"socials"`
	Tools              []*Tool              `gorm:"foreignKey:UserID" json:"tools"`

	Registrations []*Registration `gorm:"many2many:user_registrations;" json:"registrations"`
}
