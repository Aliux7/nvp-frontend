import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Employee | null;
  onConfirm: () => void;
}) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Karyawan</DialogTitle>
        </DialogHeader>

        <p>
          Yakin ingin menghapus <b>{data.name}</b>?
        </p>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-700"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
