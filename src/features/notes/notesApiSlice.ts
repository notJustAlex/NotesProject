import {
	createSelector,
	createEntityAdapter,
	EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { INote } from "../../shared/interfaces/note.interface";

const notesAdapter = createEntityAdapter<INote>({});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotes: builder.query<INote[], void>({
			query: () => ({
				url: "/notes",
				validateStatus: (response: Response, result: INote[] | any) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (
				responseData: INote[]
			): INote[] | Promise<INote[]> => {
				const loadedNotes: INote[] = responseData.map((note: INote) => {
					note.id = note._id;
					return note;
				});
				// @ts-ignore
				return notesAdapter.setAll(initialState, loadedNotes);
			},
			providesTags: (result: any, _error, _arg) => {
				if (result?.ids) {
					return [
						{ type: "Note", id: "LIST" },
						...result.ids.map((id: string) => ({ type: "Note", id })),
					];
				} else return [{ type: "Note", id: "LIST" }];
			},
		}),
		addNewNote: builder.mutation<INote, INote>({
			query: (initialNote: INote) => ({
				url: "/notes",
				method: "POST",
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: [{ type: "Note", id: "LIST" }],
		}),
		updateNote: builder.mutation<INote, INote>({
			query: (initialNote: INote) => ({
				url: "/notes",
				method: "PATCH",
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: (_result, _error, arg: INote) => [
				{ type: "Note", id: arg.id },
			],
		}),
		deleteNote: builder.mutation<void, { id: string }>({
			query: ({ id }) => ({
				url: `/notes`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (_result, _error, arg: { id: string }) => [
				{ type: "Note", id: arg.id },
			],
		}),
	}),
});

export const {
	useGetNotesQuery,
	useAddNewNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = notesApiSlice;

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData: any = createSelector(
	selectNotesResult,
	(notesResult) => notesResult.data
);

export const {
	selectAll: selectAllNotes,
	selectById: selectNoteById,
	selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
	(state: EntityState<INote> | INote): EntityState<INote> =>
		selectNotesData(state) ?? initialState
);
