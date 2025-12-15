//import type { Employee } from "./employee";

export interface AppprovalLogmanage {
    ID: number;
    comment: string;
    decision: string;
    date: string;

    //em_id?: number;
    //employee?: Employee;
}

export interface CreateApprovalLogRequest {
    ID: number;
    comment: string;
    decision: string;
    date: string;

    //   em_id?: number;
    //   employee?: Employee
}

export interface UpdateApprovalLogRequest {
    ID: number;
    comment: string;
    decision: string;
    date: string;
    //   em_id?: number;
    //   employee?: Employee;
}

export interface DeleteApprovalLogRequest {
    ID: number;
}

export interface GetApprovalLogResponse extends AppprovalLogmanage { }