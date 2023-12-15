import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
	token: string | null;
}

const initialState: AuthState = {
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
			const { accessToken } = action.payload;
			state.token = accessToken;
		},
		logOut: (state) => {
			state.token = null;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: { auth: AuthState }): string | null =>
	state.auth.token;
