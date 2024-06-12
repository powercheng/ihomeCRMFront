
export interface User {
    id: number;
    name: string;
    password: string;
    region: string;
    date: string;
}

export interface Customer {
    id: number;
    name: string;
    contact: string;
    address: string;
    status: number;
    assignee: string;
}


export interface Register {
    username: string;
    password: string;
    region: number;
    name: string;
    email: string;
}