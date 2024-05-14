import {
  ModifiedStudentProps,
  StudentDetailsProps,
  StudentProps,
} from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
  const files = event.target.files![0];
  const imageUrl = URL.createObjectURL(files);
  return { files, imageUrl };
}

// export function getInitialLetter(name: string): string {
//   const parts = name.split(" ");
//   let initials = "";

//   for (const part of parts) {
//     initials += part.charAt(0);
//     if (initials.length === 2) {
//       break;
//     }
//   }

//   if (initials.length < 2 && parts.length === 1) {
//     initials = parts[0].charAt(0);
//   }

//   return initials;
// }

export function getInitialLetter(name: string): string {
  const parts = name.split(" ");
  const firstIndex = 0;
  const lastIndex = parts.length - 1;
  let initials = "";
  parts.length === 1
    ? (initials = parts[firstIndex].charAt(0))
    : (initials = parts[firstIndex].charAt(0) + parts[lastIndex].charAt(0));

  return initials;
}

export function combineDetailWithStudent(
  data: StudentProps[]
): ModifiedStudentProps[] {
  const mappedData = data.flatMap((student) => {
    if (student.details.length === 0) {
      return {
        "Student ID": student.student_id,
        Name: student.name,
        Phone: student.phone,
        Email: student.email,
        "Date of Birth": student.date_of_birth,
        Address: student.address,
        Township: student.township,
        NRC: student.NRC,
      };
    } else {
      return student.details.map((detail) => {
        return {
          "Student ID": student.student_id,
          Name: student.name,
          Phone: student.phone,
          Email: student.email,
          "Date of Birth": student.date_of_birth,
          Address: student.address,
          Township: student.township,
          NRC: student.NRC,
          "Mark One": detail.mark1,
          "Mark Two": detail.mark2,
          "Mark Three": detail.mark3,
          Year: detail.year,
          "Total Marks": detail.total_marks,
        };
      });
    }
  });
  return mappedData;
}

export function mergeDetailWithStudent(
  data: ModifiedStudentProps[]
): StudentProps[] {
  const mergedDataMap: Map<string, StudentProps> = new Map();

  data.forEach((item) => {
    const studentId = item["Student ID"];
    if (!mergedDataMap.has(studentId)) {
      const student: StudentProps = {
        student_id: studentId,
        name: item.Name,
        phone: item.Phone,
        email: item.Email,
        date_of_birth: item["Date of Birth"],
        address: item.Address,
        township: item.Township,
        NRC: item.NRC,
        details: [],
      };
      mergedDataMap.set(studentId, student);
    }
    const student = mergedDataMap.get(studentId)!;
    if (item["Mark One"] !== undefined) {
      const detail: StudentDetailsProps = {
        year: item.Year!,
        mark1: item["Mark One"],
        mark2: item["Mark Two"]!,
        mark3: item["Mark Three"]!,
        total_marks: item["Total Marks"]!,
      };
      student.details.push(detail);
    }
  });

  const mergedData: StudentProps[] = Array.from(mergedDataMap.values());
  return mergedData;
}
