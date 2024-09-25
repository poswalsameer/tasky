"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, Trash2, PencilIcon, ClipboardCheck, CheckCircle  } from "lucide-react";
import { signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';

interface Task {
    id: number
    title: string
    description: string
    status: "To Do" | "In Progress" | "Completed"
    priority: "Low" | "Medium" | "High"
}

const columns: { title: Task["status"]; color: string }[] = [
    { title: "To Do", color: "bg-blue-600" },
    { title: "In Progress", color: "bg-yellow-600" },
    { title: "Completed", color: "bg-green-600" },
]
  
const priorityColors: Record<Task["priority"], string> = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500",
}

function Page() {

    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState<Task>({
        id: 0,
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium"
    })

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value })
    }

    const routeToTaskPage = () => {
        router.push('/tasks')
    }

    const handleSelectChange = (name: string, value: string) => {
        setNewTask({ ...newTask, [name]: value })
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    }

    const handleDeleteTask = (taskId: number) => {

        const updatedTasks = tasks.filter( task => task.id !== taskId );
        setTasks(updatedTasks);
        localStorage.setItem( 'tasks', JSON.stringify(updatedTasks) )

        // setTasks(tasks.filter(task => task.id !== taskId))
    }

    // const onDragEnd = (result: DropResult) => {
    //     const { destination, source, draggableId } = result
    
    //     if (!destination) return
    
    //     const newTasks = Array.from(tasks)
    //     const [reorderedItem] = newTasks.splice(source.index, 1)
    //     reorderedItem.status = destination.droppableId as Task["status"]
    //     newTasks.splice(destination.index, 0, reorderedItem)
    
    //     setTasks(newTasks)
    // }

    const groupedTasks = columns.reduce((acc, column) => {
        acc[column.title] = tasks.filter(task => task.status === column.title)
        return acc
    }, {} as Record<Task["status"], Task[]>)

    useEffect( () => {

        // GETTING ALL THE CURRENT TASKS ON THE FIRST RENDER TO DISPLAY THEM ON THE WEBPAGE
        const currentTasks = localStorage.getItem('tasks');
        if( currentTasks ){
            setTasks(JSON.parse(currentTasks));
        }
    
    }, [] )

  return (

        <div className="min-h-screen bg-gray-900 text-gray-100">
            
            <nav className="flex justify-between bg-gray-800 p-4">

            <div className="flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-2xl font-bold">Tasky</span>
            </div>

            <div className="container mx-auto flex gap-x-4 justify-end">

            <Button variant="secondary" className="rounded-sm font-semibold" onClick={routeToTaskPage}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Board
            </Button>

            <Button variant="secondary" className="rounded-sm font-semibold" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
            </div>
            </nav>

            <main className="container mx-auto p-4">

                {/* Create task component */}
                <Card className="mb-8 bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-white font-medium text-xl">Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                    <Input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-gray-100 border-gray-600"
                        required
                    />
                    <Textarea
                        name="description"
                        placeholder="Task Description (optional)"
                        value={newTask.description}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-gray-100 border-gray-600"
                    />
                    <Select name="status" value={newTask.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
                        <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select name="priority" value={newTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                        <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
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
                    ))}
                </div>
            </main>

        </div>
    
  )
}

export default Page
