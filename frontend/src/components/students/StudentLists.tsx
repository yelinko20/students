import { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentProps, StudentPropsWithoutIdAndDetails } from "@/types/types";
import { deleteStudent, getStudents } from "@/api/students/fetch";
import { Link } from "react-router-dom";
import { DataTablePagination } from "../DataTablePagination";
import ExcelExport from "@/components/ExcelExport";
import ExcelImport from "@/components/ExcelImport";

export const columns: ColumnDef<StudentProps>[] = [
  {
    id: "no",
    header: "No.",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
    header: () => <div className="text-right">NRC</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("NRC")}</div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-right">Phone</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium w-32">
          {row.getValue("phone")}
        </div>
      );
    },
  },
  {
    accessorKey: "date_of_birth",
    header: () => <div className="text-right">Date Of Birth</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium w-32">
          {row.getValue("date_of_birth")}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "township",
  //   header: () => <div className="text-right w-32">Township</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-right font-medium">{row.getValue("township")}</div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "address",
  //   header: () => <div className="text-right">address</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-right font-medium max-w-[500px] truncate">
  //         {row.getValue("address")}
  //       </div>
  //     );
  //   },
  // },
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
                await deleteStudent(student.id);
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

export default function StudentLists() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [data, setData] = useState<StudentProps[]>([]);

  const [query, setQuery] = useState<string>("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [dataPerPage, setDataPerPage] = useState(6);

  useEffect(() => {
    async function fetchData() {
      const res = await getStudents(query);
      setData(res);
    }
    fetchData();
  }, [query]);

  // const data = useMemo(() => {
  //   const lastDatIndex = currentPage * dataPerPage;
  //   const firstDataIndex = lastDatIndex - dataPerPage;
  //   return studentData.slice(firstDataIndex, lastDatIndex);
  // }, [studentData, currentPage, dataPerPage]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const modifiedData: StudentPropsWithoutIdAndDetails[] = data.map(
    ({ id, details, ...rest }) => rest
  );

  return (
    <div className="relative">
      <div className="flex justify-end items-center gap-8 mb-6">
        <ExcelImport />
        <ExcelExport data={modifiedData} />
        <Link to={"/add-student"}>
          <Button>Create</Button>
        </Link>
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter students..."
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <>
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      </>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      </div>
      {/* <PaginationData
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dataPerPage={dataPerPage}
      /> */}
    </div>
  );
}
