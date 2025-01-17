import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getStudentById } from "@/api/students/fetch";
import { StudentProps } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getInitialLetter } from "@/lib/utils";
import DetailTable from "./DetailTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

export default function StudentDetails() {
  const { id } = useParams();
  // const navigate = useNavigate();
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
        // navigate("/not-found");
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
          <CardHeader className={cn("flex flex-col gap-4")}>
            <div className="w-full flex justify-center">
              <Avatar
                className={cn(
                  "relative w-24 h-24 flex items-center justify-center"
                )}
              >
                <AvatarImage
                  src={studentData.image}
                  className={cn("object-cover")}
                />
                <AvatarFallback className={cn("relative p-0")}>
                  <span className="text-4xl">
                    {getInitialLetter(studentData.name)}
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className={cn("text-center")}>
              {studentData.name}
            </CardTitle>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Student ID</span>
                <span>{studentData.student_id}</span>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Phone</span>
                <span>{studentData.phone}</span>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Email</span>
                <span>{studentData.email}</span>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>NRC</span>
                <span>{studentData.NRC}</span>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Date of Birth</span>
                <span>{studentData.date_of_birth}</span>
              </CardDescription>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Township</span>
                <span>{studentData.township}</span>
              </CardDescription>
            </div>
            <div>
              <CardDescription className={cn("flex items-center gap-6")}>
                <span>Address</span>
                <span>{studentData.address}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DetailTable data={studentData.details} />
          </CardContent>
          <CardFooter className={cn("flex items-center justify-end gap-4")}>
            <Link to={`/edit/${id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Link to="/">
              <Button>Back</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
