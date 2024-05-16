import toast from "react-hot-toast";
import { AxiosError } from "axios";

import axiosInstance from "@/api/axiosInstance";
import { errorMessage } from "@/lib/errorMessage";
import { formatDate } from "@/lib/format-date";
import { StudentDetailsProps, StudentProps } from "@/types/types";

export async function getStudents(url: string) {
  try {
    const res = await axiosInstance.get(url);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

// export async function createStudent(values: StudentProps, showToast?: boolean) {
//   try {
//     const res = await axiosInstance.post("api/students/", {
//       image: values.image,
//       student_id: values.student_id,
//       name: values.name,
//       email: values.email,
//       phone: values.phone,
//       date_of_birth: formatDate(values.date_of_birth),
//       address: values.address,
//       township: values.township,
//       NRC: values.NRC,
//     });
//     if (res.status === 201) {
//       if (showToast !== false) {
//         toast.success("Student creation is successful!");
//       }
//     }
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       toast.error(errorMessage(error.response?.data), {
//         style: {
//           backgroundColor: "red",
//           color: "white",
//         },
//         iconTheme: {
//           primary: "red",
//           secondary: "white",
//         },
//       });
//     } else {
//       console.log(error);
//     }
//   }
// }

export async function createStudent(values: StudentProps) {
  try {
    const formData = new FormData();
    if (
      typeof values.image === "object" &&
      (values.image as any) instanceof File
    ) {
      formData.append("image", values.image);
    } else {
      console.warn("No image file provided for student creation.");
    }
    formData.append("student_id", values.student_id);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("date_of_birth", formatDate(values.date_of_birth));
    formData.append("address", values.address);
    formData.append("township", values.township);
    formData.append("NRC", values.NRC);
    const res = await axiosInstance.post("api/students/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 201) {
      toast.success("Student creation is successful!");
      return res.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.error("An unexpected error occurred:", error); // Log entire error for debugging
    }
  }
}

export async function deleteStudent(id: string) {
  try {
    const res = await axiosInstance.delete(`api/students/${id}/`);
    if (res.status === 204) {
      toast.success("Student has deleted successfully!");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function updateStudent(id: string, values: StudentProps) {
  try {
    const formData = new FormData();
    if (
      typeof values.image === "object" &&
      (values.image as any) instanceof File
    ) {
      formData.append("image", values.image);
    } else {
      formData.append("remove_image", "true");
      console.warn("No image file provided for student creation.");
    }
    formData.append("student_id", values.student_id);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("date_of_birth", formatDate(values.date_of_birth));
    formData.append("address", values.address);
    formData.append("township", values.township);
    formData.append("NRC", values.NRC);

    const res = await axiosInstance.put(`api/students/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 200) {
      toast.success("Student has been updated successfully");
      return res.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function updateStudentDetail(
  id: string,
  values: StudentDetailsProps
) {
  try {
    const res = await axiosInstance.put(`api/studentdetails/${values.id}/`, {
      year: values.year,
      mark1: values.mark1,
      mark2: values.mark2,
      student: id,
      mark3: values.mark3,
    });
    if (res.status === 200) {
      return { message: "Student Details Updated successfully" };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function getStudentById(id: string) {
  try {
    const res = await axiosInstance.get(`api/students/${id}/`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function createStudentDetails(
  id: string,
  values: StudentDetailsProps
) {
  try {
    const res = await axiosInstance.post(`api/studentdetails/`, {
      year: values.year,
      mark1: values.mark1,
      mark2: values.mark2,
      student: id,
      mark3: values.mark3,
    });
    if (res.status === 201) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getStudentDetails(id: string) {
  try {
    const res = await axiosInstance.get(`api/studentdetails/${id}/`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function deleteStudentDetails(id: string) {
  try {
    const res = await axiosInstance.delete(`api/studentdetails/${id}/`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(errorMessage(error.response?.data), {
        style: {
          backgroundColor: "red",
          color: "white",
        },
        iconTheme: {
          primary: "red",
          secondary: "white",
        },
      });
    } else {
      console.log(error);
    }
  }
}

export async function fetchImageAndConvert(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();

    const maxSize = 5 * 1024 * 1024;
    if (blob.size > maxSize) {
      throw new Error("Image size exceeds 5MB");
    }

    const filename = url.substring(url.lastIndexOf("/") + 1);
    const imageFile = new File([blob], filename, { type: blob.type });

    return { imageFile, blob };
  } catch (error) {
    console.error("Error loading image:", error);
  }
}
