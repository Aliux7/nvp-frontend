"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { employeeService } from "@/services/employee";
import { Employee } from "@/types/employee";

const FormDialog = ({
  open,
  onOpenChange,
  data,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Employee | null;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState<any>({
    name: "",
    age: "",
    position: "",
    salary: "",
  });

  useEffect(() => {
    if (data) setForm(data);
    else setForm({ name: "", age: "", position: "", salary: "" });
  }, [data]);

  const handleSubmit = async () => { 
    if (data) {
      await employeeService.update(data.id, form);
    } else {
      await employeeService.create(form);
    } 
    employeeService.getAll();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Karyawan" : "Tambah Karyawan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Umur"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <Input
            placeholder="Posisi"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Gaji"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />

          <Button className="w-full" onClick={handleSubmit}>
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
