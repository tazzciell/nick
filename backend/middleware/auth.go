package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sut68/team21/config"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "กรุณาเข้าสู่ระบบ"})
			ctx.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "รูปแบบ token ไม่ถูกต้อง"})
			ctx.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := config.ValidateJWT(tokenString)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่"})
			ctx.Abort()
			return
		}
		ctx.Set("user_id", claims.UserID)
		ctx.Set("sut_id", claims.SutId)
		ctx.Set("role", claims.Role)

		ctx.Next()
	}
}
