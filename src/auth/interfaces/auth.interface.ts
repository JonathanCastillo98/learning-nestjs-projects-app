import { ROLES } from "src/constants/roles";

export interface PayloadToken {
    sub: string,
    role: ROLES | string,
}

export interface AuthBody {
    username: string,
    password: string,
}