type StudentDetailsProps = {
  id: string;
  year: string;
  mark1: number;
  mark2: number;
  mark3: number;
};

type StudentProps = {
  id: string;
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

export type { StudentProps, StudentDetailsProps };
