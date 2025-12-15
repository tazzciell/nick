package services

import (
	"github.com/sut68/team21/entity"
	"gorm.io/gorm"
)

type PortfolioService interface {
	CreatePortfolio(portfolio *entity.Portfolio) error
	GetPortfolioByID(id uint) (*entity.Portfolio, error)
	GetPortfoliosByUserID(userID uint) ([]entity.Portfolio, error)
	UpdatePortfolio(id uint, portfolio *entity.Portfolio) error
	DeletePortfolio(id uint) error

	GetAllPortfolioStatuses() ([]entity.PortfolioStatus, error)
}

type portfolioService struct {
	db *gorm.DB
}

func NewPortfolioService(db *gorm.DB) PortfolioService {
	return &portfolioService{db: db}
}

func (s *portfolioService) CreatePortfolio(portfolio *entity.Portfolio) error {

	if portfolio.PortfolioStatusID == 0 {
		portfolio.PortfolioStatusID = 1
	}
	return s.db.Create(portfolio).Error
}

func (s *portfolioService) GetPortfolioByID(id uint) (*entity.Portfolio, error) {
	var portfolio entity.Portfolio

	err := s.db.Preload("PortfolioStatus").First(&portfolio, id).Error
	if err != nil {
		return nil, err
	}
	return &portfolio, nil
}

func (s *portfolioService) GetPortfoliosByUserID(userID uint) ([]entity.Portfolio, error) {
	var portfolios []entity.Portfolio
	err := s.db.Preload("PortfolioStatus").Where("user_id = ?", userID).Find(&portfolios).Error
	if err != nil {
		return nil, err
	}
	return portfolios, nil
}

func (s *portfolioService) UpdatePortfolio(id uint, data *entity.Portfolio) error {

	return s.db.Model(&entity.Portfolio{}).Where("id = ?", id).Updates(data).Error
}

func (s *portfolioService) DeletePortfolio(id uint) error {
	return s.db.Delete(&entity.Portfolio{}, id).Error
}

func (s *portfolioService) GetAllPortfolioStatuses() ([]entity.PortfolioStatus, error) {
	var statuses []entity.PortfolioStatus
	err := s.db.Find(&statuses).Error
	return statuses, err
}
