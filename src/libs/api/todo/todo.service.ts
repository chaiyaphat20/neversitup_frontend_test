import { Todo } from "@/types/todo/response.type";
import fetchApi from "../client";
import { TodoType } from "@/types/todo/todo.schema";


export const TodoServices = {
  getAllTodos: async (): Promise<Todo> => {
    try {
      const response = await fetchApi.get('/todo');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },
  
  createTodo: async (body:TodoType): Promise<Todo> => {
    try {
      const { data } = await fetchApi.post('/todo',body);
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteTodoById: async (todoId:string): Promise<Todo> => {
    try {
      const { data } = await fetchApi.delete(`/todo/${todoId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateTodo: async (todoId:string,body:TodoType): Promise<Todo> => {
    try {
      const { data } = await fetchApi.patch(`/todo/${todoId}`,body);
      return data;
    } catch (error) {
      throw error;
    }
  }
};