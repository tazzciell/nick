package entity

import(
		"gorm.io/gorm"
)
type ActivityEvaluationTopic struct {
	gorm.Model
	Name			 string `json:"name"`
	PostID 			uint   `gorm:"not null" json:"post_id"`
	ActivityEvaluationScores []*ActivityEvaluationScore `gorm:"foreignKey:ActivityEvaluationTopicID" json:"activity_evaluation_scores"`
}