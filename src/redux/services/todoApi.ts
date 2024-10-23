import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TodoItem } from '../../@types/types';


const prepareHeaders = (headers: Headers) => {
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZab0VjXzhpcmc5a0lyZzk4NnUzSnN5UzVlbHdKOFRzaGt2VDFOZElVd3MifQ.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiI5MDkxOWI5MC05ZjkzLTQxOGQtMDNmNC0wOGRjZjM4MDU3NjgiLCJuYmYiOjE3Mjk3MDEzODQsImV4cCI6MTcyOTc4Nzc4NCwiaWF0IjoxNzI5NzAxMzg0LCJpc3MiOiJDYWxtcGxldGUgQXV0aG9yaXphdGlvbiBTZXJ2ZXIiLCJhdWQiOiJDYWxtcGxldGUifQ.XwykdYjnwKwU3JsBwSVqHevTRCE4mQeza816SFX8f3y92FG12htsJmZlHtCLYfSYDbd4gqV3ZvB2Zahvs3Fzmb0QqsU-KyYu5CAG2MwxTptFrvCekTTE8a9dBqdZntuCHOp-X_IqUqpP85avAyCmOK2Uzl5kS237_BYZr0Xid1Epe3tr8Gssjwh02D6LpCq3lNeHkpDY0rTbiYR3H7uI0n3PfypVTuwJXrhFQDPkg6jU41rpSO7I2xKWnWutlcJcBVBC65KtVbN6BSnWX11RqtDGv3hntI4ooNEtJFdaPzjapjJ7UJGsdnYpRZ-_1-NkYoAGRYt_iSp1mjQI44iyBw"
    // const userId = "90919b90-9f93-418d-03f4-08dcf3805768"

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
        addTodo: builder.mutation<TodoItem, any>({
            query: (body) => ({ url: `/Todos`, method: "POST", body: body })
        }),
        deleteTodo: builder.mutation<any, string>({
            query: (id) => ({ url: `/Todos/${id}`, method: "DELETE" })
        }),
        editTodo: builder.mutation<TodoItem, TodoItem>({
            query: ({ id, ...item }) => ({ url: `/Todos/${id}`, method: "PUT", body: item })
        }),
        toggleTodo: builder.mutation<{}, string>({
            query: (id) => ({ url: `/Todos/toggle/${id}`, method: "PUT", body: {} })
        }),
    })
})

export const { useGetTodoListQuery, useAddTodoMutation, useDeleteTodoMutation, useEditTodoMutation, useToggleTodoMutation } = todoApi