"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, Trash2, PencilIcon, ClipboardCheck, CheckCircle  } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"


interface Task {
  id: number
  title: string
  description: string
  status: "To Do" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
}

export default function TaskManager() {

  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium"
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTask({ ...newTask, [name]: value })
  }

//   FUNCTION THAT CREATES A TASK AND SETS IT INTO THE ARRAY
  const handleCreateTask = (e: React.FormEvent) => {

    e.preventDefault()
    if (newTask.title.trim()) {

        const updatedTasks = [...tasks, {...newTask, id: tasks.length+1}];

        // saving the updated task list in our state
        setTasks(updatedTasks);
        // saving all the current task in the local storage
        localStorage.setItem( 'tasks', JSON.stringify(updatedTasks) )
    //   setTasks([...tasks, { ...newTask, id: tasks.length + 1 }])
        setNewTask({
            id: 0,
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium"
        })
        }
  }

//   FUNCTION THAT DELETES A TASK
  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter( task => task.id !== id );
    setTasks(updatedTasks);

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  }

  const routeToKanbanBoard = () => {
    router.push('/kanban-board')
  }

  useEffect( () => {

    // GETTING ALL THE CURRENT TASKS ON THE FIRST RENDER TO DISPLAY THEM ON THE WEBPAGE
    const currentTasks = localStorage.getItem('tasks');
    if( currentTasks ){
        setTasks(JSON.parse(currentTasks));
    }

  }, [] )

  return (
      <div className="min-h-screen bg-gray-800 text-gray-100">
        {/* Navbar */}
        <nav className="flex justify-between bg-gray-900 p-4">

            <div className="flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">Tasky</span>
            </div>

          <div className="container mx-auto flex gap-x-4 justify-end">

            <Button variant="secondary" 
            className="rounded-sm font-semibold" onClick={routeToKanbanBoard}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Board
            </Button>

            <Button variant="secondary" className="rounded-sm font-semibold" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>

        {/* Main content */}
        <main className="container mx-auto p-4">
          
          {/* Create task form */}
          <Card className="mb-8 bg-gray-900 border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-xl">Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  type="text"
                  name="title"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-gray-100 border-none rounded-sm"
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Task Description (optional)"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-none text-gray-100 rounded-sm"
                />
                <Select name="status" value={newTask.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger className="bg-gray-700 text-gray-100 border-none rounded-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="priority" value={newTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger className="bg-gray-700 text-gray-100 border-none rounded-sm">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full text-black bg-gray-400 hover:text-white">
                  <Plus className="mr-2 h-4 w-4 font-bold " />
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing tasks */}
          <Card className="bg-gray-900 border-none">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-xl">Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li key={task.id} className="bg-gray-700 bg-opacity-40 p-4 rounded-md transition-all ease-in delay-75 hover:cursor-pointer hover:-translate-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-blue-400 font-medium text-xl">
                              {task.title}
                          </h3>

                          {task.description && <p className="text-sm text-blue-200 mt-1">{task.description}</p>}

                          <div className="flex gap-x-20 gap-y-4 mt-2">
                              <div className="text-sm text-white">
                                  Status: <span className={`text-sm ${task.status === "In Progress" ? "text-yellow-500" : task.status === "To Do" ? "text-red-500" : "text-green-400"}`}>{task.status}</span>  
                              </div>
                              <div className="text-sm text-white">
                                  Priority: <span className={`text-sm ${task.priority === "Low" ? "text-yellow-500" : task.priority === "Medium" ? "text-red-300" : "text-red-400"}`}>{task.priority}</span>
                              </div>
                          </div>
                        </div>

                          <div className="flex flex-row gap-x-5">
                              <Button
                                  variant="destructive"
                                  className="rounded-sm h-8 w-8"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                  aria-label={`Delete task: ${task.title}`}
                              >
                                  <Trash2 className="h-3 w-3" />
                              </Button>

                              {/* <Button 
                                  variant="secondary"
                                  size="icon"
                                  className="rounded-sm"
                                  onClick={updateTask}>
                                  <PencilIcon className="h-4 w-4"/>
                              </Button> */}
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

          {/* <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => editTask(task)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Task name"
                      value={editingTask?.name || ""}
                      onChange={(e) =>
                        setEditingTask((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                    <Textarea
                      placeholder="Task description"
                      value={editingTask?.description || ""}
                      onChange={(e) =>
                        setEditingTask((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                    />
                    <Select
                      value={editingTask?.priority || "medium"}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setEditingTask((prev) =>
                          prev ? { ...prev, priority: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={updateTask}>Update Task</Button>
                  </div>
                </DialogContent>
              </Dialog> */}
        </main>
      </div>
  )
}