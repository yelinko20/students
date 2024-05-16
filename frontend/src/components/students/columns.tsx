import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import { StudentProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteStudent } from "@/api/students/fetch";

export const columns: ColumnDef<StudentProps>[] = [
  {
    accessorKey: "no",
    header: "No.",
    cell: ({ row }) => <div className="text-center">{row.getValue("no")}</div>,
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
    cell: ({ row }) => (
      <div className="capitalize w-20">{row.getValue("student_id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className=" w-36">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "NRC",
    header: () => <div>NRC</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("NRC")}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: () => <div>Phone</div>,
    cell: ({ row }) => {
      return <div className="font-medium w-32">{row.getValue("phone")}</div>;
    },
  },
  {
    accessorKey: "date_of_birth",
    header: () => <div>Date Of Birth</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium w-32">{row.getValue("date_of_birth")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.student_id)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <>
              <Link to={`/details/${student.id}`}>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
            </>
            <DropdownMenuSeparator />
            <>
              <Link to={`/edit/${student.id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
            </>
            <DropdownMenuItem
              onClick={async () => {
                await deleteStudent(student.id as string);
                setTimeout(() => {
                  window.location.assign("/");
                }, 1000);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
