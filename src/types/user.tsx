export interface User {
    _id: string;
    name: string;
    surname: string;
    email: string;
    address: {
        region: string;
        department: string;
        city: string;
    };
}