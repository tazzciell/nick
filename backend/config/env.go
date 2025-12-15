package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

type EnvConfig struct {
	BackendPort  string
	DatabaseURL  string
	DBUser       string
	DBPassword   string
	DBName       string
	JWTSecretKey string
}

var Env EnvConfig

func LoadEnv() {
	err := godotenv.Load("../.env")

	if err != nil {
		log.Println(".env not found")
	}

	Env = EnvConfig{
		BackendPort:  GetEnv("BACKEND_PORT"),
		DatabaseURL:  GetEnv("DATABASE_URL"),
		DBUser:       GetEnv("DB_USER"),
		DBPassword:   GetEnv("DB_PASSWORD"),
		DBName:       GetEnv("DB_NAME"),
		JWTSecretKey: GetEnv("JWT_SECRET_KEY"),
	}
}

func GetEnv(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return ""
}
