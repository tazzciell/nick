//import type { Employee } from "./employee";

export interface Certificatemanage {
    ID: number;
    title_th: string;
    title_en: string;
    detail: string;
    organizer: string;
    picture_url: string;
    signature_1_url: string;
    signature_2_url: string;
    date: string;
    type: string;

    //em_id?: number;
    //employee?: Employee;
}

export interface CreateCertificateRequest {
    ID: number;
    title_th: string;
    title_en: string;
    detail: string;
    organizer: string;
    picture_url: string;
    signature_1_url: string;
    signature_2_url: string;
    date: string;
    type: string;

    //   em_id?: number;
    //   employee?: Employee
}

export interface UpdateCertificateRequest {
    ID: number;
    title_th: string;
    title_en: string;
    detail: string;
    organizer: string;
    picture_url: string;
    signature_1_url: string;
    signature_2_url: string;
    date: string;
    type: string;
    //   em_id?: number;
    //   employee?: Employee;
}

export interface DeleteCertificateRequest {
    ID: number;
}

export interface GetCertificateResponse extends Certificatemanage { }