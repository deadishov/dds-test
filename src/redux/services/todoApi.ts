import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ItemToAdd, ItemToEdit, TodoItem } from '../../@types/types';


const prepareHeaders = (headers: Headers) => {
    const token = process.env.REACT_APP_API_TOKEN

    headers.set("Authorization", `Bearer ${token}`);

    return headers;
}

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://api.calmplete.net/api',
        prepareHeaders
    }),
    endpoints: builder => ({
        getTodoList: builder.query<TodoItem[], void>({
            query: () => ({ url: `/Todos` })
        }),
        addTodo: builder.mutation<TodoItem, ItemToAdd>({
            query: (body) => ({ url: `/Todos`, method: "POST", body: body })
        }),
        deleteTodo: builder.mutation<null, string>({
            query: (id) => ({ url: `/Todos/${id}`, method: "DELETE" })
        }),
        editTodo: builder.mutation<TodoItem, ItemToEdit>({
            query: ({ id, ...item }) => ({ url: `/Todos/${id}`, method: "PUT", body: item })
        }),
        toggleTodo: builder.mutation<{}, string>({
            query: (id) => ({ url: `/Todos/toggle/${id}`, method: "PUT", body: {} })
        }),
    })
})

export const { useGetTodoListQuery, useAddTodoMutation, useDeleteTodoMutation, useEditTodoMutation, useToggleTodoMutation } = todoApi