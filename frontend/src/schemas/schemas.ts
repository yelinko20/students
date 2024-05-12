import * as z from "zod";
const MAX_FILE_SIZE = 1024 * 1024 * 5;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const authValidators = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username must not be empty" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" })
    .trim(),
});

export const studentDetailValidator = z.object({
  year: z.coerce
    .string({ required_error: "Year is required!" })
    .min(4, { message: "Year must be a valid 4-digit string" })
    .max(4, { message: "Year must be a valid 4-digit string" }),
  mark1: z.coerce
    .number({ required_error: "Mark one is required!" })
    .min(0, { message: "Mark 1 must be between 0 and 100" })
    .max(100, { message: "Mark 1 must be between 0 and 100" }),
  mark2: z.coerce
    .number({ required_error: "Mark two is required!" })
    .min(0, { message: "Mark 2 must be between 0 and 100" })
    .max(100, { message: "Mark 2 must be between 0 and 100" }),
  mark3: z.coerce
    .number({ required_error: "Mark three is required!" })
    .min(0, { message: "Mark 3 must be between 0 and 100" })
    .max(100, { message: "Mark 3 must be between 0 and 100" }),
  total_marks: z.number().optional(),
});

export const studentFormValidator = z.object({
  image: z
    .any()
    .refine((files) => {
      if (!files || !files[0]) {
        return true;
      }
      return files[0].size <= MAX_FILE_SIZE && files[0] instanceof File;
    }, `Image must be a valid File instance and its size must be less than or equal to 5MB.`)
    .optional(),
  student_id: z
    .string({ required_error: "Student ID is required!" })
    .min(3, { message: "Student ID must be at least 3 characters long" })
    .max(10, { message: "Student ID cannot exceed 10 characters" })
    .trim(),
  name: z
    .string({ required_error: "Name is required!" })
    .min(1, { message: "Name must not be empty" })
    .max(20, { message: "Name cannot exceed 20 characters" })
    .trim(),
  NRC: z
    .string({ required_error: "NRC is required!" })
    .min(1, { message: "NRC must not be empty" })
    .max(20, { message: "NRC cannot exceed 20 characters" })
    .trim(),
  phone: z
    .string({ required_error: "Phone No. is required!" })
    .min(1, { message: "Phone No. must not be empty" })
    .max(20, { message: "Phone No. cannot exceed 20 characters" })
    .trim(),
  date_of_birth: z.union([z.string(), z.date()], {
    required_error: "Date of birth is required!",
  }),
  email: z
    .string({ required_error: "Email is required!" })
    .min(1, { message: "Email must not be empty" })
    .email({ message: "Invalid email format" })
    .trim(),
  township: z
    .string({ required_error: "Township is required!" })
    .min(1, { message: "Township must not be empty" })
    .max(100, { message: "Township cannot exceed 100 characters" })
    .trim(),
  address: z.string({ required_error: "Address is required!" }).trim(),
  details: z.array(studentDetailValidator),
});
