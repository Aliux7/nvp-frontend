"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { employeeService } from "@/services/employee";
import { io } from "socket.io-client";
import CircularProgress from "../CircularProgress";

type UploadCsvModalProps = {
  fetchEmployees: () => void;
  onUpload?: (file: File) => void;
};

export default function UploadCsvModal({
  fetchEmployees,
  onUpload,
}: UploadCsvModalProps) {
  const jobIdRef = useRef<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
    });

    socket.on("employeeImportProgress", (data) => {
      if (data.jobId === jobIdRef.current) {
        setProgress(data.processed);
      }
    });

    socket.on("employeeImportDone", (data) => {
      if (data.jobId === jobIdRef.current) {
        setProgress(-1);
        fetchEmployees();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("File harus berformat CSV");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Silakan pilih file CSV terlebih dahulu");
      return;
    }

    try {
      const res = await employeeService.uploadCsv(file);
      jobIdRef.current = res.jobId;
      alert("CSV uploaded, processing started");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    onUpload?.(file);
    setOpen(false);
    setFile(null);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={progress > 0  && progress < 100}
        className="overflow-visible relative flex items-center gap-2 w-14 bg-blue-50 border border-blue-200 text-blue-600  hover:bg-blue-200"
      >
        <Upload size={20} />
        <div className="absolute -top-1 -right-2 ">
          {progress > 0 && progress < 100 && ( 
              <CircularProgress value={progress} /> 
          )}
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md bg-white rounded-xl p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">Upload Data Karyawan</h2>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-l-lg  border rounded-lg border-blue-200
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600  hover:bg-gray-200"
              >
                Batal
              </Button>
              <Button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-100 border border-blue-200 text-blue-600  hover:bg-blue-200"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
