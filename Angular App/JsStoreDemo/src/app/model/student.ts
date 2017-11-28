export class IStudent {
    Id: number;
    Name: string;
    Semester: string;
    Course: string;
}

export class Student implements IStudent {
    Id: number = 0;
    Name: string = "";
    Semester: string = "";
    Course: string = "";
}