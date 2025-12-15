package entity

import (
	"gorm.io/gorm"
)

type ActivityEvaluationScore struct {
	gorm.Model
	Score                     float64 `json:"score"`
	ActivityEvaluationTopicID uint    `json:"activity_evaluation_topic_id"`
	ActivityEvaluationResponeID uint    `json:"activity_evaluation_respone_id"`
}