// import type { Employee } from "./employee";

// src/interfaces/post.ts

export interface Postmanage {
    ID: number;
    title: string;
    detail: string;
    status: string;
    picture?: string;
    type?: string;
    organizer?: string;
    start_date: string;
    stop_date: string;
    proposal_activity_id: number;
    user_id?: number;
}

export interface CreatePostRequest {
    title: string;
    detail: string;
    status: string;
    picture?: string;
    type?: string;
    organizer?: string;
    start_date: string;
    stop_date: string;
    proposal_activity_id: number;
    user_id: number;
}

export interface UpdatePostRequest {
    ID: number;
    title?: string;
    detail?: string;
    status?: string;
    picture?: string;
    type?: string;
    organizer?: string;
    start_date?: string;
    stop_date?: string;
    proposal_activity_id?: number;
    user_id?: number;
}

export interface DeletePostRequest {
    ID: number;
}

export interface GetPostResponse extends Postmanage { }