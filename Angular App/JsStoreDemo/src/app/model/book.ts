export class IBook {
    Id: number;
    Name: string;
    Author: string;
    Quantity: number;
}

export class Book implements IBook {
    Id: number = 0;
    Name: string = "";
    Author: string = "";
    Quantity: number = 0;
}
