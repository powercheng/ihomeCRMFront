
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

export const statusMapping: { [key: number]: string } = {
    1: "create",
    2: "measure",
    3: "design",
    4: "order",
    5: "produce",
    6: "install",
    7: "complete"
};

export const reverseStatusMapping: { [key: string]: number } = {
    "create": 1,
    "measure": 2,
    "design": 3,
    "order": 4,
    "produce": 5,
    "install": 6,
    "complete": 7
};



