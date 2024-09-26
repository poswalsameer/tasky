"use client";

import React from "react";
// import { v4 as uuidv4 } from 'uuid';
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
  PencilIcon,
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

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

const columns: { title: Task["status"]; color: string }[] = [
  { title: "To Do", color: "bg-blue-600" },
  { title: "In Progress", color: "bg-yellow-600" },
  { title: "Completed", color: "bg-green-600" },
];

const priorityColors: Record<Task["priority"], string> = {
  Low: "bg-green-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
};

function Page() {
  const router = useRouter();

  // const [todoTaskList, setToDoTaskList] = useState<Task[]>([]);
  // const [inProgressTaskList, setInProgressTaskList] = useState<Task[]>([]);
  // const [completedTaskList, setCompletedTaskList] = useState<Task[]>([]);

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

    // setTasks(tasks.filter(task => task.id !== taskId))
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

  // const groupedTasks = columns.reduce((acc, column) => {
  //   acc[column.title] = tasks.filter((task) => task.status === column.title);
  //   return acc;
  // }, {} as Record<Task["status"], Task[]>);

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
              className="bg-gray-700 bg-opacity-40 border-none my-5 p-4 rounded-md shadow-md"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-blue-400">
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
                    className="h-8 w-8 text-blue-400 hover:bg-black hover:text-blue-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-200">{task.description}</p>
            </Card>
          )}
        </Draggable>

        // <Card key={task.id} className="bg-gray-700 bg-opacity-40 border-none my-5 p-4 rounded-md shadow-md">
        //   <div className="flex justify-between items-start mb-2">
        //     <h3 className="text-lg font-medium text-blue-400">{task.title}</h3>
        //     <div className="flex items-center space-x-2">
        //       <Badge
        //         className={`${priorityColors[task.priority]} hover:${
        //           priorityColors[task.priority]
        //         } rounded font-semibold text-xs text-black`}
        //       >
        //         {task.priority}
        //       </Badge>
        //       <Button
        //         variant="ghost"
        //         size="icon"
        //         onClick={() => handleDeleteTask(task.id)}
        //         className="h-8 w-8 text-blue-400 hover:bg-black hover:text-blue-400"
        //       >
        //         <Trash2 className="h-4 w-4" />
        //         <span className="sr-only">Delete task</span>
        //       </Button>
        //     </div>
        //   </div>
        //   <p className="text-xs text-blue-200">{task.description}</p>
        // </Card>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="flex justify-between bg-gray-800 p-4">
        <div className="flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-blue-400" />
          <span className="ml-2 text-2xl font-bold">Tasky</span>
        </div>

        <div className="container mx-auto flex gap-x-4 justify-end">
          <Button
            variant="secondary"
            className="rounded-sm font-semibold"
            onClick={routeToTaskPage}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Board
          </Button>

          <Button
            variant="secondary"
            className="rounded-sm font-semibold"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {/* Create task component */}
        <Card className="mb-8 bg-gray-800 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white font-medium text-xl">
              Create New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <Input
                type="text"
                name="title"
                placeholder="Task Title"
                value={newTask.title}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-100 border-none rounded-sm "
                required
              />
              <Textarea
                name="description"
                placeholder="Task Description (optional)"
                value={newTask.description}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-100 border-none rounded-sm"
              />
              <Select
                name="status"
                value={newTask.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="bg-gray-700 text-gray-100 border-none rounded-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="priority"
                value={newTask.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger className="bg-gray-700 text-gray-100 border-none rounded-sm">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Actual Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TO DO TASKS */}
            <Droppable droppableId="toDoTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-xl font-bold mb-4">To Do</h2>
                  {renderTasks("To Do")}
                  {provided.placeholder}
                </div>
              )}
              {/* <div>
                    <h2 className="text-xl font-bold mb-4">To Do</h2>
                    {renderTasks("To Do")}
                </div> */}
            </Droppable>

            {/* IN PROGRESS TASKS */}
            <Droppable droppableId="inProgressTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-xl font-bold mb-4">In Progress</h2>
                  {renderTasks("In Progress")}
                  {provided.placeholder}
                </div>
              )}
              {/* <div>
                    <h2 className="text-xl font-bold mb-4">In Progress</h2>
                    {renderTasks("In Progress")}
                </div> */}
            </Droppable>

            {/* COMPLETED TASKS */}
            <Droppable droppableId="completedTasks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-xl font-bold mb-4">Completed</h2>
                  {renderTasks("Completed")}
                  {provided.placeholder}
                </div>
              )}
              {/* <div>
                  <h2 className="text-xl font-bold mb-4">Completed</h2>
                  {renderTasks("Completed")}
              </div> */}
            </Droppable>

            {/* {columns.map((column) => (
                      <div key={column.title} className="bg-gray-800 rounded-lg p-4">
                          <h2 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
                          <span className={`w-4 h-4 rounded-full mr-2 ${column.color}`}></span>
                          {column.title}
                          </h2>
                          <div className="space-y-4">
                          {groupedTasks[column.title].map((task) => (
                              <Card key={task.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-medium text-blue-200">{task.title}</h3>
                                  <div className="flex items-center space-x-2">
                                  <Badge className={`${priorityColors[task.priority]} hover:${priorityColors[task.priority]} rounded-sm font-semibold text-xs text-black`}>
                                      {task.priority}
                                  </Badge>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete task</span>
                                  </Button>
                                  </div>
                              </div>
                              <p className="text-sm text-gray-400">{task.description}</p>
                              </Card>
                          ))}
                          </div>
                      </div>
                      ))} */}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default Page;
