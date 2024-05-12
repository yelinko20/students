import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import { StudentProps } from "@/types/types";
import { formatDate } from "@/lib/format-date";
import { AxiosError } from "axios";

type RowData = {
  [key: string]: string | number;
};

export default function ExcelImport() {
  const [showImportInput, setShowImportInput] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<RowData[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        setImporting(true);
        const workbook = XLSX.read(event.target?.result as string, {
          type: "binary",
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        setImportedData(sheetData as RowData[]);
        setImportError(null);
      } catch (error) {
        setImportError("Error importing data. Please try again.");
        console.error(error);
      } finally {
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  async function importExcelData() {
    setIsLoading(true);
    try {
      await Promise.all(
        // @ts-ignore
        importedData.map(async (values: StudentProps) => {
          const formData = new FormData();

          if (values.image && typeof values.image === "object") {
            // @ts-ignore
            if (values.image instanceof File) {
              formData.append("image", values.image);
            } else {
              console.warn("No image file provided for student creation.");
            }
          }
          formData.append("student_id", values.student_id);
          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("phone", values.phone);
          formData.append("date_of_birth", formatDate(values.date_of_birth));
          formData.append("address", values.address);
          formData.append("township", values.township);
          formData.append("NRC", values.NRC);

          await axiosInstance.post("api/students/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        })
      );
      toast.success("Excel Import is successful!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Some of your excel data already exists!");
      } else {
        toast.error("An error occurred while importing data.");
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setShowImportInput(false);
        window.location.assign("/");
      }, 2000);
    }
  }

  return (
    <>
      <Button onClick={() => setShowImportInput(true)}>Import Excel</Button>
      {showImportInput && (
        <div className="fixed top-0 z-10 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <Card>
            <CardHeader>
              <CardTitle>
                {importedData.length
                  ? "Your Excel Data Preview"
                  : "Upload your excel file"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {importedData.length ? (
                <div
                  className={cn("mt-4", importedData.length ? "" : "hidden")}
                >
                  {/* <h2 className="text-xl font-semibold mb-2">Imported Data</h2> */}
                  <table className="border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        {importedData.length > 0 &&
                          Object.keys(importedData[0]).map((key) => (
                            <th
                              key={key}
                              className="border border-gray-400 p-2"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="border border-gray-400 p-2"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              )}
              {importError && <p className="text-red-500">{importError}</p>}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportInput(false);
                  setImportedData([]);
                }}
                disabled={importing}
              >
                Cancel
              </Button>
              <Button
                disabled={!importedData.length || importing || isLoading}
                onClick={importExcelData}
              >
                Import
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
