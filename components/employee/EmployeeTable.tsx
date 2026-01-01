"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pen, Trash } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/types/employee";
import { useRef, useState } from "react";

type Props = {
  data: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
};

export function EmployeeTable({ data, onEdit, onDelete }: Props) {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ getValue }) => `Rp. ${getValue<number>().toLocaleString()}`,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-blue-100 text-blue-600"
              onClick={() => onEdit(employee)}
            >
              <Pen size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="bg-red-100 text-red-600"
              onClick={() => onDelete(employee)}
            >
              <Trash size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });

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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });
  const gridTemplate = "180px 400px 100px 250px 250px 120px";
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <div
          className="grid sticky top-0 z-10 bg-white border-b"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {table.getHeaderGroups().map((hg) =>
            hg.headers.map((header) => (
              <div
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="px-3 py-2 cursor-pointer select-none flex items-center gap-1 font-medium"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}

                {header.column.getIsSorted() === "asc" && (
                  <ArrowUp className="h-3 w-3" />
                )}
                {header.column.getIsSorted() === "desc" && (
                  <ArrowDown className="h-3 w-3" />
                )}
                {!header.column.getIsSorted() && (
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                )}
              </div>
            ))
          )}
        </div>

        <div ref={parentRef} className="h-150 overflow-auto border rounded">
          <div
            className="relative w-full"
            style={{ height: rowVirtualizer.getTotalSize() }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];

              return (
                <div
                  key={row.id}
                  className="grid absolute w-full border-b items-center"
                  style={{
                    gridTemplateColumns: gridTemplate,
                    transform: `translateY(${virtualRow.start}px)`,
                    height: virtualRow.size,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="px-3 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
