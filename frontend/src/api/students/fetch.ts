import toast from "react-hot-toast";
import { AxiosError } from "axios";

import axiosInstance from "@/api/axiosInstance";
import { errorMessage } from "@/lib/errorMessage";
import { formatDate } from "@/lib/format-date";
import { StudentDetailsProps, StudentProps } from "@/types/types";

export async function getStudents(query: string) {
  // const url =
  //   query !== "" ? `api/students/?search=${query}` : `api/students/?search=""`;
  try {
    const res = await axiosInstance.get(`api/students/?search=${query}`);
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

export async function createStudent(values: StudentProps, showToast?: boolean) {
  try {
    const res = await axiosInstance.post("api/students/", {
      student_id: values.student_id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      date_of_birth: formatDate(values.date_of_birth),
      address: values.address,
      township: values.township,
      NRC: values.NRC,
    });
    if (res.status === 201) {
      if (showToast !== false) {
        toast.success("Student creation has successfully!");
      }
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
    const res = await axiosInstance.put(`api/students/${id}/`, {
      student_id: values.student_id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      date_of_birth: formatDate(values.date_of_birth),
      address: values.address,
      township: values.township,
      NRC: values.NRC,
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
    return { message: error };
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
