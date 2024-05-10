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
import { createStudent } from "@/api/students/fetch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
        importedData.map(async (data) => {
          // @ts-ignore
          await createStudent(data, false);
          // toast.success("Excel Import is successful!");
        })
      );
    } catch (error) {
      console.error("Error occurred during import:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        window.location.assign("/");
        setShowImportInput(false);
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
              <CardTitle>Upload your excel file</CardTitle>
            </CardHeader>
            <CardContent>
              {importedData.length ? (
                <div
                  className={cn("mt-4", importedData.length ? "" : "hidden")}
                >
                  <h2 className="text-xl font-semibold mb-2">Imported Data</h2>
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
                onClick={() => setShowImportInput(false)}
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
