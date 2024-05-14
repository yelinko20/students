type StudentDetailsProps = {
  id?: string;
  year: string;
  mark1: number;
  mark2: number;
  mark3: number;
  total_marks: number;
};

type StudentProps = {
  id?: string;
  image?: string;
  name: string;
  student_id: string;
  NRC: string;
  phone: string;
  date_of_birth: string;
  email: string;
  township: string;
  address: string;
  details: StudentDetailsProps[];
};

type StudentPropsWithoutIdAndImage = Omit<StudentProps, "id" | "image">;

type ModifiedStudentProps = {
  "Student ID": string;
  Name: string;
  Phone: string;
  Email: string;
  "Date of Birth": string;
  Address: string;
  Township: string;
  NRC: string;
  "Mark One"?: number;
  "Mark Two"?: number;
  "Mark Three"?: number;
  Year?: string;
  "Total Marks"?: number;
};

export type {
  StudentProps,
  StudentDetailsProps,
  StudentPropsWithoutIdAndImage,
  ModifiedStudentProps,
};
