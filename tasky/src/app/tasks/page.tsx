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
    <div className="
      min-h-screen text-gray-100  
      sm:min-h-screen sm:text-gray-100
      md:min-h-screen md:text-gray-100
      lg:min-h-screen lg:text-gray-100
      xl:min-h-screen xl:text-gray-100
      2xl:min-h-screen 2xl:text-gray-100" id="taskManagerPage">
      {/* Navbar */}
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
            onClick={routeToKanbanBoard}
          >
            <Columns3 className="
              mr-2 h-4 w-4
              sm:mr-2 sm:h-4 sm:w-4
              md:mr-2 md:h-4 md:w-4
              lg:mr-2 lg:h-4 lg:w-4
              xl:mr-2 xl:h-4 xl:w-4
              2xl:mr-2 2xl:h-4 2xl:w-4" />
            Board
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

      {/* Main content */}
      <main className="
        container mx-auto p-4
        sm:container sm:mx-auto sm:p-4
        md:container md:mx-auto md:p-4
        lg:container lg:mx-auto lg:p-4
        xl:container xl:mx-auto xl:p-4
        2xl:container 2xl:mx-auto 2xl:p-4">
        

        {/* Existing tasks */}
        <Card className="
          bg-transparent border-none shadow-none
          sm:bg-transparent sm:border-none sm:shadow-none
          md:bg-transparent md:border-none md:shadow-none
          lg:bg-transparent lg:border-none lg:shadow-none
          xl:bg-transparent xl:border-none xl:shadow-none
          2xl:bg-transparent 2xl:border-none 2xl:shadow-none">
          <CardHeader>
            <CardTitle className="
              text-[#2e1b4b] font-bold text-3xl
              sm:text-[#2e1b4b] sm:font-bold sm:text-3xl
              md:text-[#2e1b4b] md:font-bold md:text-4xl
              lg:text-[#2e1b4b] lg:font-bold lg:text-4xl
              xl:text-[#2e1b4b] xl:font-bold xl:text-4xl
              2xl:text-[#2e1b4b] 2xl:font-bold 2xl:text-4xl">
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <ul className="space-y-4 sm:space-y-4 md:space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="
                    bg-[#3B235F] bg-opacity-50 p-4 rounded-md shadow-xl transition-all ease-in delay-75 hover:cursor-pointer hover:translate-x-4
                    sm:bg-[#3B235F] sm:bg-opacity-50 sm:p-4 sm:rounded-md sm:shadow-xl sm:transition-all sm:ease-in sm:delay-75 sm:hover:cursor-pointer sm:hover:translate-x-4
                    md:bg-[#3B235F] md:bg-opacity-50 md:p-4 md:rounded-md md:shadow-xl md:transition-all md:ease-in md:delay-75 md:hover:cursor-pointer md:hover:translate-x-4
                    lg:bg-[#3B235F] lg:bg-opacity-50 lg:p-4 lg:rounded-md lg:shadow-xl lg:transition-all lg:ease-in lg:delay-75 lg:hover:cursor-pointer lg:hover:translate-x-4
                    xl:bg-[#3B235F] xl:bg-opacity-50 xl:p-4 xl:rounded-md xl:shadow-xl xl:transition-all xl:ease-in xl:delay-75 xl:hover:cursor-pointer xl:hover:translate-x-4
                    2xl:bg-[#3B235F] 2xl:bg-opacity-50 2xl:p-4 2xl:rounded-md 2xl:shadow-xl 2xl:transition-all 2xl:ease-in 2xl:delay-75 2xl:hover:cursor-pointer 2xl:hover:translate-x-4"
                  >
                    <div className="
                      flex justify-between items-start
                      sm:flex sm:justify-between sm:items-start
                      md:flex md:justify-between md:items-start
                      lg:flex lg:justify-between lg:items-start
                      xl:flex xl:justify-between xl:items-start
                      2xl:flex 2xl:justify-between 2xl:items-start">
                      <div className="
                        flex flex-col gap-y-1
                        sm:flex sm:flex-col sm:gap-y-1
                        md:flex md:flex-col md:gap-y-1
                        lg:flex lg:flex-col lg:gap-y-1
                        xl:flex xl:flex-col xl:gap-y-1
                        2xl:flex 2xl:flex-col 2xl:gap-y-1">
                        <h3 className="
                          text-white font-bold text-lg
                          sm:text-white sm:font-bold sm:text-xl
                          md:text-white md:font-bold md:text-xl
                          lg:text-white lg:font-bold lg:text-xl
                          xl:text-white xl:font-bold xl:text-xl
                          2xl:text-white 2xl:font-bold 2xl:text-xl">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="
                          text-xs font-bold text-[#c49cff] mt-1
                          sm:text-sm sm:font-bold sm:text-[#c49cff] sm:mt-1
                          md:text-sm md:font-bold md:text-[#c49cff] md:mt-1
                          lg:text-sm lg:font-bold lg:text-[#c49cff] lg:mt-1
                          xl:text-sm xl:font-bold xl:text-[#c49cff] xl:mt-1
                          2xl:text-sm 2xl:font-bold 2xl:text-[#c49cff] 2xl:mt-1">
                            {task.description}
                          </p>
                        )}

                        <div className="
                          flex flex-col gap-x-20 gap-y-4 mt-2
                          sm:flex sm:flex-row sm:gap-x-20 sm:gap-y-4 sm:mt-2
                          md:flex md:flex-row md:gap-x-20 md:gap-y-4 md:mt-2
                          lg:flex lg:flex-row lg:gap-x-20 lg:gap-y-4 lg:mt-2
                          xl:flex xl:flex-row xl:gap-x-20 xl:gap-y-4 xl:mt-2
                          2xl:flex 2xl:flex-row 2xl:gap-x-20 2xl:gap-y-4 2xl:mt-2">

                          {/* STATUS WALA DIV */}
                          <div className="
                            text-xs font-bold text-white
                            sm:text-sm sm:text-white
                            md:text-sm md:text-white
                            lg:text-sm lg:text-white
                            xl:text-sm xl:text-white
                            2xl:text-sm 2xl:text-white">
                            Status:{" "}
                            <span
                              className={`text-xs font-bold sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm ${
                                task.status === "In Progress"
                                  ? "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold border border-yellow-600 bg-yellow-400    sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:border sm:border-yellow-600 sm:bg-yellow-400    md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:border md:border-yellow-600 md:bg-yellow-400   lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:border lg:border-yellow-600 lg:bg-yellow-400  xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:border xl:border-yellow-600 xl:bg-yellow-400 2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:border 2xl:border-yellow-600 2xl:bg-yellow-400"
                                  : task.status === "To Do"
                                  ? "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold border border-red-700 bg-red-500    sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:border sm:border-red-700 sm:bg-red-500    md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:border md:border-red-700 md:bg-red-500   lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:border lg:border-red-700 lg:bg-red-500  xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:border xl:border-red-700 xl:bg-red-500  2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:border 2xl:border-red-700 2xl:bg-red-500"
                                  : "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold bg-green-500 border border-green-700     sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:bg-green-500 sm:border sm:border-green-700    md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:bg-green-500 md:border md:border-green-700    lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:bg-green-500 lg:border lg:border-green-700   xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:bg-green-500 xl:border xl:border-green-700  2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:bg-green-500 2xl:border 2xl:border-green-700"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>

                          {/* PRIORITY WALA DIV */}
                          <div className="
                            text-xs font-bold text-white
                            sm:text-sm sm:text-white
                            md:text-sm md:text-white
                            lg:text-sm lg:text-white
                            xl:text-sm xl:text-white
                            2xl:text-sm 2xl:text-white">
                            Priority:{" "}
                            <span
                              className={`text-xs font-bold  sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm ${
                                task.priority === "Low"
                                  ? "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold bg-green-500 border border-green-700    sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:bg-green-500 sm:border sm:border-green-700    md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:bg-green-500 md:border md:border-green-700    lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:bg-green-500 lg:border lg:border-green-700   xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:bg-green-500 xl:border xl:border-green-700   2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:bg-green-500 2xl:border 2xl:border-green-700"
                                  : task.priority === "Medium"
                                  ? "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold border border-yellow-600 bg-yellow-400     sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:border sm:border-yellow-600 sm:bg-yellow-400     md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:border md:border-yellow-600 md:bg-yellow-400     lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:border lg:border-yellow-600 lg:bg-yellow-400   xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:border xl:border-yellow-600 xl:bg-yellow-400   2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:border 2xl:border-yellow-600 2xl:bg-yellow-400"
                                  : "text-[0.65rem] px-2 py-0.5 rounded text-black font-bold border border-red-700 bg-red-500     sm:text-xs sm:px-3 sm:py-1 sm:rounded sm:text-black sm:font-bold sm:border sm:border-red-700 sm:bg-red-500    md:text-xs md:px-3 md:py-1 md:rounded md:text-black md:font-bold md:border md:border-red-700 md:bg-red-500   lg:text-xs lg:px-3 lg:py-1 lg:rounded lg:text-black lg:font-bold lg:border lg:border-red-700 lg:bg-red-500   xl:text-xs xl:px-3 xl:py-1 xl:rounded xl:text-black xl:font-bold xl:border xl:border-red-700 xl:bg-red-500  2xl:text-xs 2xl:px-3 2xl:py-1 2xl:rounded 2xl:text-black 2xl:font-bold 2xl:border 2xl:border-red-700 2xl:bg-red-500"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                        </div>

                      </div>

                      <div className="
                        flex flex-row gap-x-5
                        sm:flex sm:flex-row sm:gap-x-5
                        md:flex md:flex-row md:gap-x-5
                        lg:flex lg:flex-row lg:gap-x-5
                        xl:flex xl:flex-row xl:gap-x-5
                        2xl:flex 2xl:flex-row 2xl:gap-x-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="
                          h-7 w-7 text-white hover:bg-[#3B235F] hover:text-white
                          sm:h-7 sm:w-7 sm:text-white sm:hover:bg-[#3B235F] sm:hover:text-white
                          md:h-8 md:w-8 md:text-white md:hover:bg-[#3B235F] md:hover:text-white
                          lg:h-8 lg:w-8 lg:text-white lg:hover:bg-[#3B235F] lg:hover:text-white
                          xl:h-8 xl:w-8 xl:text-white xl:hover:bg-[#3B235F] xl:hover:text-white
                          2xl:h-8 2xl:w-8 2xl:text-white 2xl:hover:bg-[#3B235F] 2xl:hover:text-white"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <Trash2 className="
                            h-4 w-4
                            sm:h-3 sm:w-3
                            md:h-4 md:w-4
                            lg:h-4 lg:w-4
                            xl:h-4 xl:w-4
                            2xl:h-4 2xl:w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-purple-950">No tasks yet. Create one above!</p>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
