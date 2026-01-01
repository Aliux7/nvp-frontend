"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import FormDialog from "@/components/employee/FormDialog";
import { useAuthStore } from "@/store/authStore";
import { employeeService } from "@/services/employee";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Pen, Trash } from "lucide-react";
import DeleteConfirmDialog from "@/components/employee/DeleteConfirmDialog";
import EmployeeNotification from "@/components/notification/PopoverNotification";
import UploadCsvModal from "@/components/employee/UploadCsvDialog";
import { EmployeeTable } from "@/components/employee/EmployeeTable";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchEmployees = async () => {
    const data = await employeeService.getAll();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-4 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Karyawan</h1>
        <div className="flex justify-center items-center gap-3">
          <Button onClick={() => setOpenForm(true)}>Tambah Karyawan</Button>
          <UploadCsvModal fetchEmployees={fetchEmployees} />
          <EmployeeNotification />
        </div>
      </div>

      <EmployeeTable
        data={employees}
        onEdit={(emp) => {
          setSelected(emp);
          setOpenForm(true);
        }}
        onDelete={(emp) => {
          setSelected(emp);
          setOpenDelete(true);
        }}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        data={selected}
        onSuccess={() => {
          setSelected(null);
          fetchEmployees();
        }}
      />

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        data={selected}
        onConfirm={async () => {
          if (selected) {
            await employeeService.delete(selected.id);
            setSelected(null);
            fetchEmployees();
          }
        }}
      />
    </div>
  );
}
