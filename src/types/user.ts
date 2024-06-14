
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
    status: number | string;
}


export interface Register {
    username: string;
    password: string;
    email: string;
    region: number;
}

export const statusMapping: { [key: number]: string } = {
    1: "creating",
    2: "measuring",
    3: "designing",
    4: "producing",
    5: "complete"
};

export const reverseStatusMapping: { [key: string]: number } = {
    "creating": 1,
    "measuring": 2,
    "designing": 3,
    "producing": 4,
    "complete": 5
};



