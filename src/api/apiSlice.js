import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001'}),
    tagTypes: ['Notes'],
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => '/notes',
            providesTags: ['Notes']
        }),
        createNote: builder.mutation({
            query: note => ({
                url: '/notes',
                method: 'POST',
                body: note
            }),
            invalidatesTags: ['Notes']
        }),
        deleteNote: builder.mutation({
            query: id => ({
                url: `/notes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Notes']
        }),
        updateNote: builder.mutation({
            query: note => ({
                url: `/notes/${note.id}`,
                method: 'PUT',
                body: note
            }),
            invalidatesTags: ['Notes']
        })
    })
});

export const {useGetNotesQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation} = apiSlice;