import * as z from "zod";

export const authValidators = z.object({
  username: z.string({ required_error: "UserName is required" }).min(1).max(20),
  password: z.string({ required_error: "password is required" }).min(4).max(20),
});

export const studentDetailValidator = z.object({
  year: z.coerce.string({ required_error: "year is required!" }).max(4),
  mark1: z.coerce.number({ required_error: "mark one is required!" }),
  mark2: z.coerce.number({ required_error: "mark two is required!" }),
  mark3: z.coerce.number({ required_error: "mark three is required!" }),
  total_marks: z.number().optional(),
});

export const studentFormValidator = z.object({
  student_id: z
    .string({ required_error: "student ID is required!" })
    .min(3, { message: "student ID is required!" })
    .max(10),
  name: z
    .string({ required_error: "Name is required!" })
    .min(1, { message: "Name is required!" })
    .max(20),
  NRC: z
    .string({ required_error: "NRC is required!" })
    .min(1, { message: "NRC is required!" })
    .max(20),
  phone: z
    .string({ required_error: "Phone No. is required!" })
    .min(1, { message: "Phone No. is required!" })
    .max(20)
    .trim(),
  date_of_birth: z.union([z.string(), z.date()], {
    required_error: "Date is required!",
  }),
  email: z
    .string({ required_error: "Email is required!" })
    .min(1, { message: "Email is required!" })
    .email({ message: "must be validated email" })
    .trim(),
  township: z.string({ required_error: "Township is required!" }).max(100),
  address: z.string({ required_error: "Address is required!" }),
  details: z.array(studentDetailValidator),
});
