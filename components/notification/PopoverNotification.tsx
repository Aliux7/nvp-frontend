"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 

const EmployeeNotification = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      withCredentials: true,
    });

    socket.on("employeeNotification", (data: any) => {
      console.log("Connected to server:", socket.id);
      setNotifications((prev) => [...prev, data]);
      console.log(notifications);
    });

    socket.on("employeeNotification", (data) => {
      console.log("Notification:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="bg-white h-full relative">
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid ">
          {notifications.map((n, i) => (
            <div key={i} className="p-2 border-b rounded">
              {n.message}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeeNotification;
