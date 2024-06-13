
export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    region: number;
}

export interface Customer {
    id: number;
    name: string;
    contact: string;
    address: string;
    cac: number;
    salesRep: string;
    status: number;
}


export interface Register {
    username: string;
    password: string;
    email: string;
    region: number;
}