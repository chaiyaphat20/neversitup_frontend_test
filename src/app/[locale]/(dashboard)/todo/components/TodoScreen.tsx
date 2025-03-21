'use client'

import { TodoServices } from '@/libs/api/todo/todo.service'
import { TodoData } from '@/types/todo/response.type'
import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, RefreshCw, Plus, CheckSquare } from 'lucide-react'
import { TodoSchema, TodoType } from '@/types/todo/todo.schema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

function TodoScreen() {
  const [data, setData] = useState<TodoData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState<string | null>(null)
  const router = useRouter()

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TodoType>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const editForm = useForm<TodoType>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const handleDeleteTodo = async(id: string) => {
    try {
      setIsLoading(true)
      await TodoServices.deleteTodoById(id)
      fetchAllTodos()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllTodos = async() => {
    try {
      setIsLoading(true)
      const result = await TodoServices.getAllTodos()
      setData(result.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const onSubmit = async(formData: TodoType) => {
    try {
      setIsLoading(true)
      await TodoServices.createTodo(formData)
      reset()
      fetchAllTodos()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const startEditMode = (todo: TodoData) => {
    setEditMode(String(todo.id))
    editForm.reset({
      title: todo.title,
      description: todo.description || ''
    })
  }

  const cancelEdit = () => {
    setEditMode(null)
    editForm.reset()
  }

  const onSubmitEdit = async(id: string) => {
    const formData = editForm.getValues()
    
    try {
      setIsLoading(true)
      await TodoServices.updateTodo(id, formData)
      setEditMode(null)
      fetchAllTodos()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAllTodos()
  }, [])

  const gotoTable = () =>{
    router.push("/table")
  }

  return (
    <div className="bg-gray-100 p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          <CheckSquare className="inline mr-2" />
          Todo List
        </h1>
        
        <div className="bg-white p-5 mb-5 rounded shadow">
          <h2 className="text-lg mb-3">Add Todo</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block mb-1">Title</label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Please enter title"
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block mb-1">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full p-2 border rounded"
                    placeholder="Please enter Description (optional)"
                    rows={3}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              {isLoading ? 'Adding...' : (
                <>
                  <Plus className="inline mr-1" />
                  Add Todo
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg mb-3">Total List</h2>
          
          {isLoading && data.length === 0 && (
            <div className="text-center py-4">
              <RefreshCw className="inline animate-spin text-blue-500 mb-2" />
              <p>Loading...</p>
            </div>
          )}
          
          {!isLoading && data.length === 0 && (
          <div className="text-center py-5 border-2 border-dashed border-gray-200 rounded">
            <p>No tasks to do</p>
            <p className="text-sm text-gray-500">Add new tasks above</p>
          </div>
          )}
          
          <ul className="divide-y divide-gray-200">
            {data.map(item => (
              <li key={item.id} className="py-3">
                {editMode === String(item.id) ? (
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="mb-2">
                      <label className="block mb-1">Title</label>
                      <Controller
                        name="title"
                        control={editForm.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full p-2 border rounded"
                          />
                        )}
                      />
                      {editForm.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{editForm.formState.errors.title.message}</p>
                      )}
                    </div>
                    <div className="mb-2">
                      <label className="block mb-1">Description</label>
                      <Controller
                        name="description"
                        control={editForm.control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className="w-full p-2 border rounded"
                            rows={2}
                          />
                        )}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={editForm.handleSubmit(() => onSubmitEdit(String(item.id)))}
                        disabled={isLoading}
                        className="flex-1 bg-blue-500 text-white p-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-200 p-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditMode(item)}
                          className="text-blue-500"
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(String(item.id))}
                          className="text-red-500"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-center mt-4">
          <button
            onClick={fetchAllTodos}
            disabled={isLoading}
            className="bg-white px-4 py-2 rounded border text-blue-500"
          >
            <RefreshCw className={`inline mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      
        <button
        onClick={gotoTable}
            className="bg-white px-4 py-2 rounded border text-red-500"
          >
            Goto table
          </button>
      </div>
    </div>
  )
}

export default TodoScreen