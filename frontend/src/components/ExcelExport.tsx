import { Button } from "@/components/ui/button";
import { StudentPropsWithoutIdAndDetails } from "@/types/types";
import * as XLSX from "xlsx";

export default function ExcelExport({
  data,
}: {
  data: StudentPropsWithoutIdAndDetails[];
}) {
  const fileType = "xlsx";

  function exportCSV() {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `students.${fileType}`);
  }

  return <Button onClick={exportCSV}>Export Excel</Button>;
}