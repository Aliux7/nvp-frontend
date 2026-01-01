import api from "@/lib/axios";

type EmployeePayload = {
  name: string;
  age: number;
  position: string;
  salary: number;
};

export const employeeService = {
  getAll: async () => {
    const { data } = await api.get("/employees");
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/employees/${id}`);
    return data.data;
  },

  create: async (payload: EmployeePayload) => {
    const { data } = await api.post("/employees", payload);
    return data.data;
  },

  uploadCsv: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/employees/import-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
  update: async (id: string, payload: EmployeePayload) => {
    const { data } = await api.put(`/employees/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/employees/${id}`);
  },
};
