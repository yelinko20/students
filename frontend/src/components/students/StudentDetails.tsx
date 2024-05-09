import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById } from "@/api/students/fetch";
import { StudentProps } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DetailTable from "./DetailTable";

export default function StudentDetails() {
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

  return (
    <>
      {studentData && (
        <Card>
          <CardHeader>
            <CardTitle>{studentData.name}</CardTitle>
            <div className="grid grid-cols-3 gap-6">
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Student ID</div>
                <div>{studentData.student_id}</div>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Phone</div>
                <div>{studentData.phone}</div>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Email</div>
                <div>{studentData.email}</div>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>NRC</div>
                <div>{studentData.NRC}</div>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Date of Birth</div>
                <div>{studentData.date_of_birth}</div>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Township</div>
                <div>{studentData.township}</div>
              </CardDescription>
            </div>
            <div className="pt-4">
              <CardDescription className={cn("flex items-center gap-6")}>
                <div>Address</div>
                <div>{studentData.address}</div>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DetailTable data={studentData.details} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
