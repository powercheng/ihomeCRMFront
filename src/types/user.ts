
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
    1: "create",
    2: "measure",
    3: "design",
    4: "produce & install",
    5: "Complete"
};

export const reverseStatusMapping: { [key: string]: number } = {
    "create": 1,
    "measure": 2,
    "design": 3,
    "produce & install": 4,
    "Complete": 5
};



