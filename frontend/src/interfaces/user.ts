import type { Major } from "./major";
import type { Faculty } from "./faculty";
import type { Role } from "./role";


export interface UserSocial {
  platform: string;
  url: string;
}

export interface User {
  id?: number;
  sut_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  year: number;
  bio: string;
  avatar_url: string;
  faculty_id: number;
  faculty: Faculty;
  major_id: number;
  major: Major;
  role_id: number;
  role: Role;
  skills: string[];        
  interests: string[];     
  tools: string[];         
  socials: UserSocial[];   
}
