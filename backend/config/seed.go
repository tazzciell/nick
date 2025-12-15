package config

import (
	"log"

	"github.com/sut68/team21/entity"
)

func SeedAllData() {
	SeedRoles()
	SeedFaculties()
	SeedMajors()
	SeedUsers()
	SeedLocations()
	SeedPortfolioStatuses()
}

func SeedRoles() {

	var count int64
	DB.Model(&entity.Role{}).Count(&count)
	if count > 0 {
		return
	}
	roles := []entity.Role{
		{Name: "admin"},
		{Name: "student"},
	}
	for _, role := range roles {
		DB.FirstOrCreate(&role, entity.Role{Name: role.Name})
	}
}

func SeedUsers() {

	var count int64
	DB.Model(&entity.User{}).Count(&count)
	if count > 0 {
		return
	}
	adminPasswordHash, err := HashPassword("adminpass")
	if err != nil {
		log.Printf("Error hashing admin password: %v", err)
		return
	}

	studentPasswordHash, err := HashPassword("student123")
	if err != nil {
		log.Printf("Error hashing student password: %v", err)
		return
	}

	users := []entity.User{
		// Admin User
		{
			SutId:     "A00000000",
			Email:     "admin@sut.ac.th",
			Password:  adminPasswordHash,
			FirstName: "แอดมิน",
			LastName:  "แอดมิน",
			Phone:     "0812345678",
			FacultyID: 1,
			MajorID:   3,
			Year:      4,
			RoleID:    1,
			AvatarURL: "upload/profile/default-avatar.png",
		},
		// Student Users
		{
			SutId:     "B6614690",
			Email:     "b6614690@g.sut.ac.th",
			Password:  studentPasswordHash,
			FirstName: "พิพัฒน์",
			LastName:  "อินสวรรค์",
			Phone:     "0823456789",
			FacultyID: 1,
			MajorID:   3,
			Year:      3,
			RoleID:    2,
			AvatarURL: "upload/profile/default-avatar.png",
			Bio:       "ชอบ se ที่สุดในโลก ",
			Skills:    []*entity.Skill{{Name: "Go"}, {Name: "React"}, {Name: "Node.js"}},
			Interests: []*entity.Interest{{Name: "Coding"}, {Name: "Gaming"}, {Name: "Reading"}},
			Tools:     []*entity.Tool{{Name: "VSCode"}, {Name: "Git"}, {Name: "Docker"}},
			Socials: []*entity.Social{
				{Platform: "GitHub", Link: "https://github.com/PIPAT-I"},
				{Platform: "Facebook", Link: "https://www.facebook.com/pipat.insawan?locale=th_TH"},
				{Platform: "Instagram", Link: "https://www.instagram.com/j_insawan"},
			},
		},
		// Demo Users สำหรับทดสอบดู profile คนอื่น
		{
			SutId:     "B6600001",
			Email:     "b6600001@g.sut.ac.th",
			Password:  studentPasswordHash,
			FirstName: "สมชาย",
			LastName:  "ใจดี",
			Phone:     "0891111111",
			FacultyID: 1,
			MajorID:   3,
			Year:      2,
			RoleID:    2,
			AvatarURL: "upload/profile/default-avatar.png",
			Bio:       "นักศึกษาวิศวกรรมคอมพิวเตอร์ ชอบเขียนโปรแกรม",
			Skills:    []*entity.Skill{{Name: "Python"}, {Name: "Machine Learning"}},
			Interests: []*entity.Interest{{Name: "AI"}, {Name: "Data Science"}},
			Tools:     []*entity.Tool{{Name: "Jupyter"}, {Name: "PyCharm"}},
		},
		{
			SutId:     "B6600002",
			Email:     "b6600002@g.sut.ac.th",
			Password:  studentPasswordHash,
			FirstName: "สมหญิง",
			LastName:  "รักเรียน",
			Phone:     "0892222222",
			FacultyID: 1,
			MajorID:   5,
			Year:      3,
			RoleID:    2,
			AvatarURL: "upload/profile/default-avatar.png",
			Bio:       "ชอบออกแบบ UI/UX และทำ Frontend",
			Skills:    []*entity.Skill{{Name: "Figma"}, {Name: "React"}, {Name: "CSS"}},
			Interests: []*entity.Interest{{Name: "UI Design"}, {Name: "UX Research"}},
			Tools:     []*entity.Tool{{Name: "Figma"}, {Name: "Adobe XD"}},
		},
		{
			SutId:     "B6600003",
			Email:     "b6600003@g.sut.ac.th",
			Password:  studentPasswordHash,
			FirstName: "วีระ",
			LastName:  "สู้งาน",
			Phone:     "0893333333",
			FacultyID: 1,
			MajorID:   7,
			Year:      4,
			RoleID:    2,
			AvatarURL: "upload/profile/default-avatar.png",
			Bio:       "Backend Developer ชอบ Golang และ Database",
			Skills:    []*entity.Skill{{Name: "Go"}, {Name: "PostgreSQL"}, {Name: "Docker"}},
			Interests: []*entity.Interest{{Name: "Backend"}, {Name: "DevOps"}},
			Tools:     []*entity.Tool{{Name: "GoLand"}, {Name: "DBeaver"}},
		},
	}

	for _, user := range users {
		var existing entity.User
		if err := DB.Where("sut_id = ?", user.SutId).First(&existing).Error; err != nil {
			DB.Create(&user)
		}
	}
}

func SeedFaculties() {
	var count int64
	DB.Model(&entity.Faculty{}).Count(&count)
	if count > 0 {
		return
	}
	faculties := []entity.Faculty{
		{Name: "คณะวิศวกรรมศาสตร์"},
	}
	for _, faculty := range faculties {
		DB.FirstOrCreate(&faculty, entity.Faculty{Name: faculty.Name})
	}
}

func SeedMajors() {
	var count int64
	DB.Model(&entity.Major{}).Count(&count)
	if count > 0 {
		return
	}
	majors := []entity.Major{{Name: "วิศวกรรมการผลิตอัตโนมัติและหุ่นยนต์"},
		{Name: "วิศวกรรมเกษตรและอาหาร"},
		{Name: "วิศวกรรมคอมพิวเตอร์"},
		{Name: "วิศวกรรมเคมี"},
		{Name: "วิศวกรรมเครื่องกล"},
		{Name: "วิศวกรรมปิโตรเลียมและเทคโนโลยีธรณี"},
		{Name: "วิศวกรรมไฟฟ้า"},
		{Name: "วิศวกรรมโทรคมนาคม"},
		{Name: "วิศวกรรมยานยนต์"},
		{Name: "วิศวกรรมโยธา"},
		{Name: "วิศวกรรมสิ่งแวดล้อม"},
		{Name: "วิศวกรรมอุตสาหการ"},
		{Name: "วิศวกรรมโลหการ"},
		{Name: "วิศวกรรมอิเล็กทรอนิกส์"},
		{Name: "วิศวกรรมขนส่งและโลจิสติกส์"},
		{Name: "วิศวกรรมเซรามิก"},
		{Name: "วิศวกรรมพอลิเมอร์"},
		{Name: "ยังไม่สังกัดสาขา"},
	}

	for _, major := range majors {
		DB.FirstOrCreate(&major, entity.Major{Name: major.Name})
	}
}

func SeedLocations() {
	var count int64
	DB.Model(&entity.Location{}).Count(&count)
	if count > 0 {
		return
	}

	// Helper function to create pointer to float64
	floatPtr := func(f float64) *float64 {
		return &f
	}

	locations := []entity.Location{
		// อาคารเรียนรวม
		{
			Building:      "อาคารเรียนรวม 1 (LRC1)",
			Room:          "101",
			Detail:        "ห้องเรียนใหญ่ ชั้น 1",
			Latitude:      floatPtr(14.8825),
			Longitude:     floatPtr(102.0175),
			MapURL:        "https://maps.google.com/?q=14.8825,102.0175",
			PlaceImageURL: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
		},
		{
			Building:      "อาคารเรียนรวม 1 (LRC1)",
			Room:          "201",
			Detail:        "ห้องเรียนกลาง ชั้น 2",
			Latitude:      floatPtr(14.8825),
			Longitude:     floatPtr(102.0175),
			MapURL:        "https://maps.google.com/?q=14.8825,102.0175",
			PlaceImageURL: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
		},
		{
			Building:      "อาคารเรียนรวม 2 (LRC2)", 
			Room:          "301",
			Detail:        "ห้องเรียนใหญ่ ชั้น 3",
			Latitude:      floatPtr(14.8830),
			Longitude:     floatPtr(102.0180),
			MapURL:        "https://maps.google.com/?q=14.8830,102.0180",
			PlaceImageURL: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
		},
		{
			Building:      "อาคารเรียนรวม 3 (LRC3)",
			Room:          "401",
			Detail:        "ห้องประชุมใหญ่",
			Latitude:      floatPtr(14.8835),
			Longitude:     floatPtr(102.0185),
			MapURL:        "https://maps.google.com/?q=14.8835,102.0185",
			PlaceImageURL: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
		},

		// อาคารคณะวิศวกรรมศาสตร์
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 1 (EN1)",
			Room:          "1101",
			Detail:        "ห้องปฏิบัติการคอมพิวเตอร์",
			Latitude:      floatPtr(14.8800),
			Longitude:     floatPtr(102.0150),
			MapURL:        "https://maps.google.com/?q=14.8800,102.0150",
			PlaceImageURL: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 2 (EN2)",
			Room:          "2201",
			Detail:        "ห้องเรียนใหญ่",
			Latitude:      floatPtr(14.8805),
			Longitude:     floatPtr(102.0155),
			MapURL:        "https://maps.google.com/?q=14.8805,102.0155",
			PlaceImageURL: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 3 (EN3)",
			Room:          "3301",
			Detail:        "ห้องปฏิบัติการไฟฟ้า",
			Latitude:      floatPtr(14.8810),
			Longitude:     floatPtr(102.0148),
			MapURL:        "https://maps.google.com/?q=14.8810,102.0148",
			PlaceImageURL: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 4 (EN4)",
			Room:          "4401",
			Detail:        "ห้องปฏิบัติการเครื่องกล",
			Latitude:      floatPtr(14.8815),
			Longitude:     floatPtr(102.0143),
			MapURL:        "https://maps.google.com/?q=14.8815,102.0143",
			PlaceImageURL: "https://images.unsplash.com/photo-1581092160607-ee67e6f89844?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 5 (EN5)",
			Room:          "5501",
			Detail:        "ห้องปฏิบัติการโยธา",
			Latitude:      floatPtr(14.8820),
			Longitude:     floatPtr(102.0140),
			MapURL:        "https://maps.google.com/?q=14.8820,102.0140",
			PlaceImageURL: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 11 (EN11)",
			Room:          "11101",
			Detail:        "ห้องเรียนรวม",
			Latitude:      floatPtr(14.8795),
			Longitude:     floatPtr(102.0145),
			MapURL:        "https://maps.google.com/?q=14.8795,102.0145",
			PlaceImageURL: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800",
		},
		{
			Building:      "อาคารคณะวิศวกรรมศาสตร์ 12 (EN12)",
			Room:          "12201",
			Detail:        "ห้องปฏิบัติการหุ่นยนต์",
			Latitude:      floatPtr(14.8790),
			Longitude:     floatPtr(102.0152),
			MapURL:        "https://maps.google.com/?q=14.8790,102.0152",
			PlaceImageURL: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
		},

		// อาคารเฉลิมพระเกียรติ
		{
			Building:      "อาคารเฉลิมพระเกียรติ 72 พรรษา",
			Room:          "A101",
			Detail:        "ห้องประชุมใหญ่",
			Latitude:      floatPtr(14.8840),
			Longitude:     floatPtr(102.0165),
			MapURL:        "https://maps.google.com/?q=14.8840,102.0165",
			PlaceImageURL: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
		},
		{
			Building:      "อาคารเฉลิมพระเกียรติ 72 พรรษา",
			Room:          "B201",
			Detail:        "ห้องสัมมนา",
			Latitude:      floatPtr(14.8840),
			Longitude:     floatPtr(102.0165),
			MapURL:        "https://maps.google.com/?q=14.8840,102.0165",
			PlaceImageURL: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
		},

		// ศูนย์ภาษา
		{
			Building:      "ศูนย์ภาษา (LC)",
			Room:          "101",
			Detail:        "ห้องเรียนภาษาอังกฤษ",
			Latitude:      floatPtr(14.8818),
			Longitude:     floatPtr(102.0170),
			MapURL:        "https://maps.google.com/?q=14.8818,102.0170",
			PlaceImageURL: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
		},
		{
			Building:      "ศูนย์ภาษา (LC)",
			Room:          "201",
			Detail:        "ห้องปฏิบัติการภาษา",
			Latitude:      floatPtr(14.8818),
			Longitude:     floatPtr(102.0170),
			MapURL:        "https://maps.google.com/?q=14.8818,102.0170",
			PlaceImageURL: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
		},

		// หอประชุมและลานกิจกรรม
		{
			Building:      "หอประชุมมหาวิทยาลัย",
			Room:          "Main Hall",
			Detail:        "หอประชุมใหญ่ จุได้ 2,000 คน",
			Latitude:      floatPtr(14.8845),
			Longitude:     floatPtr(102.0168),
			MapURL:        "https://maps.google.com/?q=14.8845,102.0168",
			PlaceImageURL: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
		},
		{
			Building:      "หอประชุมเล็ก",
			Room:          "Conference Room",
			Detail:        "ห้องประชุม จุได้ 200 คน",
			Latitude:      floatPtr(14.8842),
			Longitude:     floatPtr(102.0172),
			MapURL:        "https://maps.google.com/?q=14.8842,102.0172",
			PlaceImageURL: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
		},
		{
			Building:      "ลานกิจกรรมหน้าอาคารเรียนรวม 1",
			Room:          "-",
			Detail:        "พื้นที่กลางแจ้งสำหรับจัดกิจกรรม",
			Latitude:      floatPtr(14.8828),
			Longitude:     floatPtr(102.0178),
			MapURL:        "https://maps.google.com/?q=14.8828,102.0178",
			PlaceImageURL: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
		},
		{
			Building:      "ลานกิจกรรมข้าง Canteen",
			Room:          "-",
			Detail:        "พื้นที่จัดกิจกรรมกลางแจ้ง",
			Latitude:      floatPtr(14.8822),
			Longitude:     floatPtr(102.0182),
			MapURL:        "https://maps.google.com/?q=14.8822,102.0182",
			PlaceImageURL: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
		},

		// ห้องสมุด
		{
			Building:      "อาคารสำนักหอสมุด",
			Room:          "ชั้น 1",
			Detail:        "ห้องอ่านหนังสือทั่วไป",
			Latitude:      floatPtr(14.8835),
			Longitude:     floatPtr(102.0162),
			MapURL:        "https://maps.google.com/?q=14.8835,102.0162",
			PlaceImageURL: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
		},
		{
			Building:      "อาคารสำนักหอสมุด",
			Room:          "ชั้น 2",
			Detail:        "ห้องค้นคว้าและทำงานกลุ่ม",
			Latitude:      floatPtr(14.8835),
			Longitude:     floatPtr(102.0162),
			MapURL:        "https://maps.google.com/?q=14.8835,102.0162",
			PlaceImageURL: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
		},
		{
			Building:      "อาคารสำนักหอสมุด",
			Room:          "ชั้น 3",
			Detail:        "ห้องศึกษาเงียบ",
			Latitude:      floatPtr(14.8835),
			Longitude:     floatPtr(102.0162),
			MapURL:        "https://maps.google.com/?q=14.8835,102.0162",
			PlaceImageURL: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
		},

		// ศูนย์กีฬา
		{
			Building:      "อาคารกีฬา 1",
			Room:          "สนามบาสเกตบอล",
			Detail:        "สนามในร่ม",
			Latitude:      floatPtr(14.8785),
			Longitude:     floatPtr(102.0170),
			MapURL:        "https://maps.google.com/?q=14.8785,102.0170",
			PlaceImageURL: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
		},
		{
			Building:      "อาคารกีฬา 1",
			Room:          "สนามแบดมินตัน",
			Detail:        "สนามในร่ม 6 คอร์ต",
			Latitude:      floatPtr(14.8785),
			Longitude:     floatPtr(102.0170),
			MapURL:        "https://maps.google.com/?q=14.8785,102.0170",
			PlaceImageURL: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
		},
		{
			Building:      "สนามฟุตบอล",
			Room:          "-",
			Detail:        "สนามหญ้าเทียมมาตรฐาน",
			Latitude:      floatPtr(14.8780),
			Longitude:     floatPtr(102.0165),
			MapURL:        "https://maps.google.com/?q=14.8780,102.0165",
			PlaceImageURL: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
		},
		{
			Building:      "สนามวอลเลย์บอล",
			Room:          "-",
			Detail:        "สนามกลางแจ้ง",
			Latitude:      floatPtr(14.8782),
			Longitude:     floatPtr(102.0168),
			MapURL:        "https://maps.google.com/?q=14.8782,102.0168",
			PlaceImageURL: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
		},

		// โรงอาหาร
		{
			Building:      "โรงอาหารกลาง (Canteen)",
			Room:          "-",
			Detail:        "โรงอาหารใหญ่ ด้านหน้ามหาวิทยาลัย",
			Latitude:      floatPtr(14.8820),
			Longitude:     floatPtr(102.0185),
			MapURL:        "https://maps.google.com/?q=14.8820,102.0185",
			PlaceImageURL: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800",
		},
		{
			Building:      "โรงอาหาร EN",
			Room:          "-",
			Detail:        "โรงอาหารคณะวิศวกรรมศาสตร์",
			Latitude:      floatPtr(14.8808),
			Longitude:     floatPtr(102.0150),
			MapURL:        "https://maps.google.com/?q=14.8808,102.0150",
			PlaceImageURL: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
		},
		{
			Building:      "โรงอาหารหอพัก",
			Room:          "-",
			Detail:        "โรงอาหารบริเวณหอพัก",
			Latitude:      floatPtr(14.8770),
			Longitude:     floatPtr(102.0155),
			MapURL:        "https://maps.google.com/?q=14.8770,102.0155",
			PlaceImageURL: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
		},

		// สวนสาธารณะและพื้นที่พักผ่อน
		{
			Building:      "สวน SUT",
			Room:          "-",
			Detail:        "สวนสาธารณะกลางมหาวิทยาลัย",
			Latitude:      floatPtr(14.8814),
			Longitude:     floatPtr(102.0162),
			MapURL:        "https://maps.google.com/?q=14.8814,102.0162",
			PlaceImageURL: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
		},
		{
			Building:      "ลานน้ำพุ",
			Room:          "-",
			Detail:        "จุดนัดพบกลาง",
			Latitude:      floatPtr(14.8816),
			Longitude:     floatPtr(102.0167),
			MapURL:        "https://maps.google.com/?q=14.8816,102.0167",
			PlaceImageURL: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
		},

		// อื่นๆ
		{
			Building:      "ออนไลน์ (Online)",
			Room:          "-",
			Detail:        "จัดกิจกรรมผ่านระบบออนไลน์",
			Latitude:      nil,
			Longitude:     nil,
			MapURL:        "",
			PlaceImageURL: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800",
		},
		{
			Building:      "นอกสถานที่",
			Room:          "-",
			Detail:        "กิจกรรมนอกมหาวิทยาลัย",
			Latitude:      nil,
			Longitude:     nil,
			MapURL:        "",
			PlaceImageURL: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
		},
	}

	for _, location := range locations {
		DB.FirstOrCreate(&location, entity.Location{
			Building: location.Building,
			Room:     location.Room,
		})
	}
}

func SeedPortfolioStatuses() {
	var count int64
	DB.Model(&entity.PortfolioStatus{}).Count(&count)
	if count > 0 {
		return
	}
	statuses := []entity.PortfolioStatus{
		{StatusName: "Pending"},
		{StatusName: "Approved"},
		{StatusName: "Rejected"},
	}
	for _, status := range statuses {

		DB.FirstOrCreate(&status, entity.PortfolioStatus{StatusName: status.StatusName})
	}

	log.Println("✅ Seed locations completed successfully")
}
