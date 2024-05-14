import { Button } from "@/components/ui/button";
import { ModifiedStudentProps } from "@/types/types";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function ExcelExport({
  data,
}: {
  data: ModifiedStudentProps[];
}) {
  const fileType = "xlsx";

  function exportCSV() {
    if (!data.length) {
      toast.error("There is no data to export");
      return;
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, `students.${fileType}`);
    }
  }

  return <Button onClick={exportCSV}>Export Excel</Button>;
}
