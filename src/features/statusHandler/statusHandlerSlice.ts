import { createSlice } from "@reduxjs/toolkit";

const statusHandlerSlice = createSlice({
	name: "statusHandler",
	initialState: {
		isLoading: false,
		isError: false,
		isEmailModal: false,
		isNewNoteModal: false,
		editNote: "",
	},
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.isError = action.payload;
		},
		setEmailModal: (state, action) => {
			state.isEmailModal = action.payload;
		},
		setNewNoteModal: (state, action) => {
			state.isNewNoteModal = action.payload;
		},
		setEditNote: (state, action) => {
			state.editNote = action.payload;
		},
	},
});

export const {
	setLoading,
	setError,
	setEmailModal,
	setNewNoteModal,
	setEditNote,
} = statusHandlerSlice.actions;

export default statusHandlerSlice.reducer;
