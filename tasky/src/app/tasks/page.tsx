"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, Trash2, CheckCircle, Columns3 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

export default function TaskManager() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTask({ ...newTask, [name]: value });
  };

  //   FUNCTION THAT CREATES A TASK AND SETS IT INTO THE ARRAY
  const handleCreateTask = (e: React.FormEvent) => {

    console.log("Create button clicked");

    e.preventDefault();
    if (newTask.title.trim()) {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];

      // saving the updated task list in our state
      setTasks(updatedTasks);
      // saving all the current task in the local storage
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setNewTask({
        id: 0,
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
      });
    }
  };

  //   FUNCTION THAT DELETES A TASK
  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const routeToKanbanBoard = () => {
    router.push("/kanban-board");
  };

  useEffect(() => {
    // GETTING ALL THE CURRENT TASKS ON THE FIRST RENDER TO DISPLAY THEM ON THE WEBPAGE
    const currentTasks = localStorage.getItem("tasks");
    if (currentTasks) {
      setTasks(JSON.parse(currentTasks));
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-100" id="taskManagerPage">
      {/* Navbar */}
      <nav className="flex justify-between bg-[#3B235F] p-4">
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="text-[#3B235F] text-xs font-bold">
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[45rem] text-black border-none shadow-2xl" id="DialogBackground">

            <DialogHeader>
              <DialogTitle className="text-xl text-[#211236]">Create New Task</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid gap-4 py-4">
                
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right font-bold text-[#211236]">
                      Title
                    </Label>
                    <Input
                      type="text"
                      name="title"
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="w-80 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm transition-all ease-out delay-75 focus:border-2 focus:translate-x-2 "
                      required
                    />
                  </div>

                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right font-bold text-[#211236]">
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      placeholder="Task Description (optional)"
                      value={newTask.description}
                      onChange={handleInputChange}
                      className="w-80 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm transition-all ease-out delay-75 focus:border-2 focus:translate-x-2 "
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right font-bold text-[#211236]">
                      Status
                    </Label>
                    <Select
                      name="status"
                      value={newTask.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="w-80 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm focus:border-2">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right font-bold text-[#211236]">
                      Priority
                    </Label>
                    <Select
                      name="priority"
                      value={newTask.priority}
                      onValueChange={(value) =>
                        handleSelectChange("priority", value)
                      }
                    >
                      <SelectTrigger className="w-80 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm focus:border-2">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

              </div>

              <DialogFooter>
                <Button type="submit" className="bg-[#211236] font-medium transition-all ease-in delay-75 hover:bg-[#2f194e] ">Create</Button>
              </DialogFooter>

            </form>

          </DialogContent>
        </Dialog>

        <div className="container mx-auto flex gap-x-4 justify-end">
          <Button
            variant="secondary"
            className="rounded-sm text-xs font-bold"
            onClick={routeToKanbanBoard}
          >
            <Columns3 className="mr-2 h-4 w-4" />
            Board
          </Button>

          <Button
            variant="destructive"
            className="rounded-sm font-semibold"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto p-4">
        

        {/* Existing tasks */}
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-[#2e1b4b] font-bold text-4xl">
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="bg-[#3B235F] bg-opacity-50 p-4 rounded-md shadow-xl transition-all ease-in delay-75 hover:cursor-pointer hover:translate-x-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-y-1">
                        <h3 className="text-white font-bold text-xl">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-sm font-bold text-[#c49cff] mt-1">
                            {task.description}
                          </p>
                        )}

                        <div className="flex gap-x-20 gap-y-4 mt-2">

                          {/* STATUS WALA DIV */}
                          <div className="text-sm text-white">
                            Status:{" "}
                            <span
                              className={`text-sm ${
                                task.status === "In Progress"
                                  ? "text-xs px-3 py-1 rounded text-black font-bold border border-yellow-600 bg-yellow-400"
                                  : task.status === "To Do"
                                  ? "text-xs px-3 py-1 rounded text-black font-bold border border-red-700 bg-red-500"
                                  : "text-xs px-3 py-1 rounded text-black font-bold bg-green-500 border border-green-700"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>

                          {/* PRIORITY WALA DIV */}
                          <div className="text-sm text-white">
                            Priority:{" "}
                            <span
                              className={`text-sm ${
                                task.priority === "Low"
                                  ? " text-xs px-3 py-1 rounded text-black font-bold bg-green-500 border border-green-700"
                                  : task.priority === "Medium"
                                  ? " text-xs px-3 py-1 rounded text-black font-bold border border-yellow-600 bg-yellow-400"
                                  : "text-xs px-3 py-1 rounded text-black font-bold border border-red-700 bg-red-500"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                        </div>

                      </div>

                      <div className="flex flex-row gap-x-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-[#3B235F] hover:text-white"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No tasks yet. Create one above!</p>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
