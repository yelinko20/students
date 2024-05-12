import { getStudentById } from "@/api/students/fetch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForm from "../StudentForm";
import { StudentProps } from "@/types/types";

export default function EditStudent() {
  const { id } = useParams();
  const [studentData, setStudentData] = useState<StudentProps>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const student = await getStudentById(id!);
        setStudentData(student);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <StudentForm initialValues={studentData} />;
}
