import * as z from "zod";
import { useMemo, useState } from "react";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

import { FormWrapper } from "@/components/form-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { studentFormValidator } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Townships } from "@/lib/townships";
import {
  createStudent,
  createStudentDetails,
  deleteStudentDetails,
  updateStudent,
  updateStudentDetail,
} from "@/api/students/fetch";
import { StudentDetailsProps, StudentProps } from "@/types/types";

export default function StudentForm({
  initialValues,
}: {
  initialValues?: StudentProps;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = useMemo(() => !!id, [id]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues = isUpdate
    ? initialValues
    : {
        student_id: "",
        name: "",
        NRC: "",
        email: "",
        phone: "",
        address: "",
        township: "",
        details: [{ mark1: 0, mark2: 0, mark3: 0, year: "", totalMarks: 0 }],
      };

  const form = useForm<z.infer<typeof studentFormValidator>>({
    resolver: zodResolver(studentFormValidator),
    defaultValues,
  });
  // @ts-ignore
  async function formSubmit(values: z.infer<typeof studentFormValidator>) {
    setIsLoading(true);
    try {
      let detailsArray = [];
      if (isUpdate) {
        // @ts-ignore
        const data = (await updateStudent(
          initialValues!.id,
          values as StudentProps
        )) as StudentProps;

        detailsArray = values.details.map((detail, index) => ({
          id: data.details[index]?.id ?? null,
          mark1: detail.mark1 || null,
          mark2: detail.mark2 || null,
          mark3: detail.mark3 || null,
          year: detail.year || "",
        }));
        if (data.details) {
          await Promise.all(
            detailsArray.map(async (d) => {
              // @ts-ignore

              if (d.id === null) {
                await createStudentDetails(data.id, d as StudentDetailsProps);
              } else {
                await updateStudentDetail(data.id, d as StudentDetailsProps);
              }
            })
          );
        }

        if (data.details) {
          const processedIds = detailsArray.map((d) => d.id);

          const idsNotProcessed = data.details
            .filter((detail) => !processedIds.includes(detail.id))
            .map((detail) => detail.id);
          await Promise.all(
            idsNotProcessed.map(async (id) => await deleteStudentDetails(id))
          );
        }
      } else {
        // @ts-ignore
        const data = (await createStudent(values)) as StudentProps;
        if (data) {
          values.details.map(
            async (d) =>
              await createStudentDetails(data.id, d as StudentDetailsProps)
          );
        }
      }
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control: form.control,
  });

  const addStudentDetail = () => {
    append({
      mark1: 0,
      mark2: 0,
      mark3: 0,
      year: "",
      total_marks: 0,
    });
  };

  const formValues = useWatch({
    name: "details",
    control: form.control,
  });

  const calculateTotalMarks = (index: number) => {
    const studentDetail = formValues[index];
    if (studentDetail) {
      const total =
        parseInt(String(studentDetail.mark1 || 0)) +
        parseInt(String(studentDetail.mark2 || 0)) +
        parseInt(String(studentDetail.mark3 || 0));
      return total;
    }
  };

  return (
    <FormWrapper
      title={isUpdate ? "Update Student" : "Add Student"}
      description=""
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Student ID"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NRC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRC</FormLabel>
                  <FormControl>
                    <Input placeholder="NRC" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={isLoading}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: any) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown-buttons"
                        fromYear={1940}
                        toYear={2024}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="township"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TownShip</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a township" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Townships.map((township) => (
                        <SelectItem key={township.value} value={township.value}>
                          {township.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Address..."
                    className="resize-none"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="text-right">
              <div></div>
              <Button type="button" onClick={addStudentDetail}>
                Add Student Details
                <PlusCircle className="ml-3" />
              </Button>
            </div>
            {fields.map((_, index) => {
              const totalMarks = calculateTotalMarks(index);
              return (
                <div
                  className="grid grid-cols-6 place-content-center gap-4"
                  key={index}
                >
                  <FormField
                    control={form.control}
                    name={`details.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="Year" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`details.${index}.mark1`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mark 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Mark 1"
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`details.${index}.mark2`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mark 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Mark 2"
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`details.${index}.mark3`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mark 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Mark 3"
                            type="number"
                            {...field}
                            min={1}
                            max={100}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`details.${index}.total_marks`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Toatl Marks</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Total Marks"
                            type="number"
                            {...field}
                            value={totalMarks}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-4 mt-7">
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button disabled={isLoading}>
              {isUpdate ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
}
