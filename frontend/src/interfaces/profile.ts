// Profile related interfaces

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  faculty_id: number;
  major_id: number;
  year: number;
  bio?: string;
  skills?: string[];
  interests?: string[];
  tools?: string[];
  socials?: SocialMediaInput[];
}

export interface SocialMediaInput {
  platform: string;
  url: string;
}

export interface UploadAvatarResponse {
  message?: string;
  avatar_url?: string;
  error?: string;
}

export interface ProfileUpdateResponse {
  message?: string;
  error?: string;
}
