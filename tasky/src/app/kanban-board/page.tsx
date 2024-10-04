"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Plus,
  Trash2,
  ClipboardCheck,
  CheckCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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


const priorityColors: Record<Task["priority"], string> = {
  Low: "bg-green-500 border border-green-700 hover:bg-green-500 hover:border hover:border-green-700",
  Medium: "border border-yellow-600 bg-yellow-400 hover:border hover:border-yellow-600 hover:bg-yellow-400",
  High: "border-red-700 bg-red-500 hover:bg-red-500 hover:border hover:border-red-700",
};

function Page() {

  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];

      // saving the updated task list in our state
      setTasks(updatedTasks);
      // saving all the current task in the local storage
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      //   setTasks([...tasks, { ...newTask, id: tasks.length + 1 }])
      setNewTask({
        id: 0,
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const routeToTaskPage = () => {
    router.push("/tasks");
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTask({ ...newTask, [name]: value });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const onDragEnd = (result: DropResult) => {
    
    const { destination, source, draggableId } = result;
    // If the task is dropped outside a droppable area, do nothing
    if (!destination) return;
    // If the task is dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id.toString() === draggableId);

    if (!draggedTask) return; // Safety check

    // Update the task's status based on the destination column
    let updatedTasks = [...tasks];
    const updatedTask = { ...draggedTask };

    if (destination.droppableId === "toDoTasks") {
      updatedTask.status = "To Do";
    } else if (destination.droppableId === "inProgressTasks") {
      updatedTask.status = "In Progress";
    } else if (destination.droppableId === "completedTasks") {
      updatedTask.status = "Completed";
    }

    // Remove the task from its current position and insert it in the new position
    updatedTasks = updatedTasks.filter((task) => task.id !== draggedTask.id);
    updatedTasks.splice(destination.index, 0, updatedTask);

    // Save the updated tasks list
    setTasks(updatedTasks);

    // Also update the local storage if needed
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  }

  useEffect(() => {
    // GETTING ALL THE CURRENT TASKS ON THE FIRST RENDER TO DISPLAY THEM ON THE WEBPAGE
    const currentTasks = localStorage.getItem("tasks");
    if (currentTasks) {
      setTasks(JSON.parse(currentTasks));
    }
  }, []);

  const renderTasks = (status: Task["status"]) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task,index) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
          {(provided) => (
            <Card
              className="bg-[#3B235F] bg-opacity-60 border-none my-4 p-4 rounded-md shadow-lg transition-all ease-in delay-75 hover:-translate-y-1"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${priorityColors[task.priority]} hover:${
                      priorityColors[task.priority]
                    } rounded font-semibold text-xs text-black`}
                  >
                    {task.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="h-8 w-8 text-white hover:bg-[#3B235F] hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
              <p className="text-sm font-bold text-[#c49cff]">{task.description}</p>
            </Card>
          )}
        </Draggable>

      ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100"
    id="kanbanBoardPage"
    >
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
            onClick={routeToTaskPage}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            List
          </Button>

          <Button
            variant="destructive"
            className="rounded-sm font-semibold"
            onClick={handleLogout}
          >
            <LogOut className=" h-4 w-4" />
          </Button>
        </div>
      </nav>

      <main className="container mt-10 mx-auto p-4">
        {/* Create task component */}
        
        {/* Actual Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TO DO TASKS */}
            <Droppable droppableId="toDoTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl text-[#2e1b4b] font-bold mb-4">To Do</h2>
                  {renderTasks("To Do")}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* IN PROGRESS TASKS */}
            <Droppable droppableId="inProgressTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl text-[#2e1b4b] font-bold mb-4">In Progress</h2>
                  {renderTasks("In Progress")}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* COMPLETED TASKS */}
            <Droppable droppableId="completedTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-2xl text-[#2e1b4b] font-bold mb-4">Completed</h2>
                  {renderTasks("Completed")}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default Page;
