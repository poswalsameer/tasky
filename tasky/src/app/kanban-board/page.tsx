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
    <div className="
      min-h-screen bg-gray-900 text-gray-100  
      sm:min-h-screen sm:bg-gray-900 sm:text-gray-100
      md:min-h-screen md:bg-gray-900 md:text-gray-100
      lg:min-h-screen lg:bg-gray-900 lg:text-gray-100
      xl:min-h-screen xl:bg-gray-900 xl:text-gray-100
      2xl:min-h-screen 2xl:bg-gray-900 2xl:text-gray-100"
    id="kanbanBoardPage"
    >
      <nav className="
        flex justify-between bg-[#3B235F] p-4
        sm:flex sm:justify-between sm:bg-[#3B235F] sm:p-4
        md:flex md:justify-between md:bg-[#3B235F] md:p-4
        lg:flex lg:justify-between lg:bg-[#3B235F] lg:p-4
        xl:flex xl:justify-between xl:bg-[#3B235F] xl:p-4
        2xl:flex 2xl:justify-between 2xl:bg-[#3B235F] 2xl:p-4">
        
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="
              text-[#3B235F] text-xs font-bold
              sm:text-[#3B235F] sm:text-xs sm:font-bold
              md:text-[#3B235F] md:text-xs md:font-bold
              lg:text-[#3B235F] lg:text-xs lg:font-bold
              xl:text-[#3B235F] xl:text-xs xl:font-bold
              2xl:text-[#3B235F] 2xl:text-xs 2xl:font-bold">
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="
            w-[21rem] text-black border-none shadow-2xl
            sm:w-[40rem] sm:text-black sm:border-none sm:shadow-2xl
            md:w-[42rem] md:text-black md:border-none md:shadow-2xl
            lg:w-[45rem] lg:text-black lg:border-none lg:shadow-2xl
            xl:w-[45rem] xl:text-black xl:border-none xl:shadow-2xl
            2xl:w-[45rem] 2xl:text-black 2xl:border-none 2xl:shadow-2xl" id="DialogBackground">

            <DialogHeader>
              <DialogTitle className="
                text-lg text-[#211236]
                sm:text-xl sm:text-[#211236]
                md:text-xl md:text-[#211236]
                lg:text-xl lg:text-[#211236]
                xl:text-xl xl:text-[#211236]
                2xl:text-xl 2xl:text-[#211236]">
                  Create New Task
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateTask} className="space-y-4 sm:space-y-4 md:space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-4">
              <div className="
                grid gap-4 py-4
                sm:grid sm:gap-4 sm:py-4
                md:grid md:gap-4 md:py-4
                lg:grid lg:gap-4 lg:py-4
                xl:grid xl:gap-4 xl:py-4
                2xl:grid 2xl:gap-4 2xl:py-4">
                
                  <div className="
                    grid grid-cols-4 items-center gap-10
                    sm:grid sm:grid-cols-4 sm:items-center sm:gap-4
                    md:grid md:grid-cols-4 md:items-center md:gap-4
                    lg:grid lg:grid-cols-4 lg:items-center lg:gap-4
                    xl:grid xl:grid-cols-4 xl:items-center xl:gap-4
                    2xl:grid 2xl:grid-cols-4 2xl:items-center 2xl:gap-4">
                    <Label htmlFor="name" className="
                      text-right font-bold text-[#211236]
                      sm:text-right sm:font-bold sm:text-[#211236]
                      md:text-right md:font-bold md:text-[#211236]
                      lg:text-right lg:font-bold lg:text-[#211236]
                      xl:text-right xl:font-bold xl:text-[#211236]
                      2xl:text-right 2xl:font-bold 2xl:text-[#211236]">
                      Title
                    </Label>
                    <Input
                      type="text"
                      name="title"
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="
                      w-48 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm transition-all ease-out delay-75 focus:border-2 focus:translate-x-2
                      sm:w-80 sm:font-bold sm:placeholder:text-[#211236] sm:border-2 sm:border-[#211236] sm:rounded-sm sm:transition-all sm:ease-out sm:delay-75 sm:focus:border-2 sm:focus:translate-x-2
                      md:w-80 md:font-bold md:placeholder:text-[#211236] md:border-2 md:border-[#211236] md:rounded-sm md:transition-all md:ease-out md:delay-75 md:focus:border-2 md:focus:translate-x-2
                      lg:w-80 lg:font-bold lg:placeholder:text-[#211236] lg:border-2 lg:border-[#211236] lg:rounded-sm lg:transition-all lg:ease-out lg:delay-75 lg:focus:border-2 lg:focus:translate-x-2
                      xl:w-80 xl:font-bold xl:placeholder:text-[#211236] xl:border-2 xl:border-[#211236] xl:rounded-sm xl:transition-all xl:ease-out xl:delay-75 xl:focus:border-2 xl:focus:translate-x-2 
                      2xl:w-80 2xl:font-bold 2xl:placeholder:text-[#211236] 2xl:border-2 2xl:border-[#211236] 2xl:rounded-sm 2xl:transition-all 2xl:ease-out 2xl:delay-75 2xl:focus:border-2 2xl:focus:translate-x-2 "
                      required
                    />
                  </div>

                  
                  <div className="
                    grid grid-cols-4 items-center gap-10
                    sm:grid sm:grid-cols-4 sm:items-center sm:gap-4
                    md:grid md:grid-cols-4 md:items-center md:gap-4
                    lg:grid lg:grid-cols-4 lg:items-center lg:gap-4
                    xl:grid xl:grid-cols-4 xl:items-center xl:gap-4
                    2xl:grid 2xl:grid-cols-4 2xl:items-center 2xl:gap-4">
                    <Label htmlFor="username" className="
                      text-right font-bold text-[#211236]
                      sm:text-right sm:font-bold sm:text-[#211236]
                      md:text-right md:font-bold md:text-[#211236]
                      lg:text-right lg:font-bold lg:text-[#211236]
                      xl:text-right xl:font-bold xl:text-[#211236]
                      2xl:text-right 2xl:font-bold 2xl:text-[#211236]">
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      placeholder="Task Description (optional)"
                      value={newTask.description}
                      onChange={handleInputChange}
                      className="
                      w-48 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm transition-all ease-out delay-75 focus:border-2 focus:translate-x-2
                      sm:w-80 sm:font-bold sm:placeholder:text-[#211236] sm:border-2 sm:border-[#211236] sm:rounded-sm sm:transition-all sm:ease-out sm:delay-75 sm:focus:border-2 sm:focus:translate-x-2
                      md:w-80 md:font-bold md:placeholder:text-[#211236] md:border-2 md:border-[#211236] md:rounded-sm md:transition-all md:ease-out md:delay-75 md:focus:border-2 md:focus:translate-x-2
                      lg:w-80 lg:font-bold lg:placeholder:text-[#211236] lg:border-2 lg:border-[#211236] lg:rounded-sm lg:transition-all lg:ease-out lg:delay-75 lg:focus:border-2 lg:focus:translate-x-2
                      xl:w-80 xl:font-bold xl:placeholder:text-[#211236] xl:border-2 xl:border-[#211236] xl:rounded-sm xl:transition-all xl:ease-out xl:delay-75 xl:focus:border-2 xl:focus:translate-x-2
                      2xl:w-80 2xl:font-bold 2xl:placeholder:text-[#211236] 2xl:border-2 2xl:border-[#211236] 2xl:rounded-sm 2xl:transition-all 2xl:ease-out 2xl:delay-75 2xl:focus:border-2 2xl:focus:translate-x-2 "
                    />
                  </div>

                  <div className="
                    grid grid-cols-4 items-center gap-10
                    sm:grid sm:grid-cols-4 sm:items-center sm:gap-4
                    md:grid md:grid-cols-4 md:items-center md:gap-4
                    lg:grid lg:grid-cols-4 lg:items-center lg:gap-4
                    xl:grid xl:grid-cols-4 xl:items-center xl:gap-4
                    2xl:grid 2xl:grid-cols-4 2xl:items-center 2xl:gap-4">
                    <Label htmlFor="username" className="
                      text-right font-bold text-[#211236]
                      sm:text-right sm:font-bold sm:text-[#211236]
                      md:text-right md:font-bold md:text-[#211236]
                      lg:text-right lg:font-bold lg:text-[#211236]
                      xl:text-right xl:font-bold xl:text-[#211236]
                      2xl:text-right 2xl:font-bold 2xl:text-[#211236]">
                      Status
                    </Label>
                    <Select
                      name="status"
                      value={newTask.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="
                        w-48 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm focus:border-2
                        sm:w-80 sm:font-bold sm:placeholder:text-[#211236] sm:border-2 sm:border-[#211236] sm:rounded-sm sm:focus:border-2
                        md:w-80 md:font-bold md:placeholder:text-[#211236] md:border-2 md:border-[#211236] md:rounded-sm md:focus:border-2
                        lg:w-80 lg:font-bold lg:placeholder:text-[#211236] lg:border-2 lg:border-[#211236] lg:rounded-sm lg:focus:border-2
                        xl:w-80 xl:font-bold xl:placeholder:text-[#211236] xl:border-2 xl:border-[#211236] xl:rounded-sm xl:focus:border-2
                        2xl:w-80 2xl:font-bold 2xl:placeholder:text-[#211236] 2xl:border-2 2xl:border-[#211236] 2xl:rounded-sm 2xl:focus:border-2">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                
                  <div className="
                    grid grid-cols-4 items-center gap-10
                    sm:grid sm:grid-cols-4 sm:items-center sm:gap-4
                    md:grid md:grid-cols-4 md:items-center md:gap-4
                    lg:grid lg:grid-cols-4 lg:items-center lg:gap-4
                    xl:grid xl:grid-cols-4 xl:items-center xl:gap-4
                    2xl:grid 2xl:grid-cols-4 2xl:items-center 2xl:gap-4">
                    <Label htmlFor="username" className="
                      text-right font-bold text-[#211236]
                      sm:text-right sm:font-bold sm:text-[#211236]
                      md:text-right md:font-bold md:text-[#211236]
                      lg:text-right lg:font-bold lg:text-[#211236]
                      xl:text-right xl:font-bold xl:text-[#211236]
                      2xl:text-right 2xl:font-bold 2xl:text-[#211236]">
                      Priority
                    </Label>
                    <Select
                      name="priority"
                      value={newTask.priority}
                      onValueChange={(value) =>
                        handleSelectChange("priority", value)
                      }
                    >
                      <SelectTrigger className="
                        w-48 font-bold placeholder:text-[#211236] border-2 border-[#211236] rounded-sm focus:border-2
                        sm:w-80 sm:font-bold sm:placeholder:text-[#211236] sm:border-2 sm:border-[#211236] sm:rounded-sm sm:focus:border-2
                        md:w-80 md:font-bold md:placeholder:text-[#211236] md:border-2 md:border-[#211236] md:rounded-sm md:focus:border-2
                        lg:w-80 lg:font-bold lg:placeholder:text-[#211236] lg:border-2 lg:border-[#211236] lg:rounded-sm lg:focus:border-2
                        xl:w-80 xl:font-bold xl:placeholder:text-[#211236] xl:border-2 xl:border-[#211236] xl:rounded-sm xl:focus:border-2
                        2xl:w-80 2xl:font-bold 2xl:placeholder:text-[#211236] 2xl:border-2 2xl:border-[#211236] 2xl:rounded-sm 2xl:focus:border-2">
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
                <Button type="submit" className="
                  bg-[#211236] font-medium transition-all ease-in delay-75 hover:bg-[#2f194e]
                  sm:bg-[#211236] sm:font-medium sm:transition-all sm:ease-in sm:delay-75 sm:hover:bg-[#2f194e]
                  md:bg-[#211236] md:font-medium md:transition-all md:ease-in md:delay-75 md:hover:bg-[#2f194e]
                  lg:bg-[#211236] lg:font-medium lg:transition-all lg:ease-in lg:delay-75 lg:hover:bg-[#2f194e]
                  xl:bg-[#211236] xl:font-medium xl:transition-all xl:ease-in xl:delay-75 xl:hover:bg-[#2f194e]
                  2xl:bg-[#211236] 2xl:font-medium 2xl:transition-all 2xl:ease-in 2xl:delay-75 2xl:hover:bg-[#2f194e] ">Create</Button>
              </DialogFooter>

            </form>

          </DialogContent>
      </Dialog>

        <div className="
          container mx-auto flex gap-x-4 justify-end
          sm:container sm:mx-auto sm:flex sm:gap-x-4 sm:justify-end
          md:container md:mx-auto md:flex md:gap-x-4 md:justify-end
          lg:container lg:mx-auto lg:flex lg:gap-x-4 lg:justify-end
          xl:container xl:mx-auto xl:flex xl:gap-x-4 xl:justify-end
          2xl:container 2xl:mx-auto 2xl:flex 2xl:gap-x-4 2xl:justify-end">
          <Button
            variant="secondary"
            className="
            rounded-sm text-xs font-bold 
            sm:rounded-sm sm:text-xs sm:font-bold 
            md:rounded-sm md:text-xs md:font-bold 
            lg:rounded-sm lg:text-xs lg:font-bold 
            xl:rounded-sm xl:text-xs xl:font-bold  
            2xl:rounded-sm 2xl:text-xs 2xl:font-bold"
            onClick={routeToTaskPage}
          >
            <ClipboardCheck className="
              mr-2 h-4 w-4
              sm:mr-2 sm:h-4 sm:w-4
              md:mr-2 md:h-4 md:w-4
              lg:mr-2 lg:h-4 lg:w-4
              xl:mr-2 xl:h-4 xl:w-4
              2xl:mr-2 2xl:h-4 2xl:w-4" />
            List
          </Button>

          <Button
            variant="destructive"
            className="
            rounded-sm font-semibold
            sm:rounded-sm sm:font-semibold
            md:rounded-sm md:font-semibold
            lg:rounded-sm lg:font-semibold
            xl:rounded-sm xl:font-semibold
            2xl:rounded-sm 2xl:font-semibold"
            onClick={handleLogout}
          >
            <LogOut className=" 
              h-4 w-4
              sm:h-4 sm:w-4
              md:h-4 md:w-4
              lg:h-4 lg:w-4
              xl:h-4 xl:w-4
              2xl:h-4 2xl:w-4" />
          </Button>
        </div>
      </nav>

      <main className="container mt-10 mx-auto p-4">
        
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
