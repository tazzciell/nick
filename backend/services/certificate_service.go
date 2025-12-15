package services

import (
	"errors"
	"time"

	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type CertificateService struct {
	db *gorm.DB
}

func NewCertificateService(db *gorm.DB) *CertificateService {
	return &CertificateService{db: db}
}

// CREATE
func (s *CertificateService) Create(cert *entity.Certificate) (*entity.Certificate, error) {

	if cert.TitleTH == "" || cert.Type == "" {
		return nil, errors.New("title_th and type are required")
	}
	if cert.UserID == 0 || cert.RegistrationID == 0 || cert.ResultID == "" {
		return nil, errors.New("user_id, registration_id and result_id are required")
	}

	if cert.Date.IsZero() {
		cert.Date = time.Now()
	}

	if err := s.db.Create(cert).Error; err != nil {
		return nil, err
	}

	return cert, nil
}

// GET MY CERTIFICATES
func (s *CertificateService) GetByUserID(userID uint) ([]entity.Certificate, error) {
	var certs []entity.Certificate

	err := s.db.
		Where("user_id = ?", userID).
		Order("date DESC").
		Find(&certs).Error

	if err != nil {
		return nil, err
	}

	return certs, nil
}

// GET BY ID
func (s *CertificateService) GetByID(id uint) (*entity.Certificate, error) {
	var cert entity.Certificate

	if err := s.db.First(&cert, id).Error; err != nil {
		return nil, err
	}

	return &cert, nil
}

// DELETE
func (s *CertificateService) Delete(id uint) error {
	result := s.db.Delete(&entity.Certificate{}, id)
	if result.RowsAffected == 0 {
		return errors.New("certificate not found")
	}
	return result.Error
}
