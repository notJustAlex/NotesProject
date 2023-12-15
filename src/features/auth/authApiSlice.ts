import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
import { ILogIn } from "../../shared/interfaces/login.interface";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials: ILogIn) => ({
				url: "/auth",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					dispatch(logOut());
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
				} catch (err: string | unknown) {
					throw new Error(typeof err === "string" ? err : undefined);
				}
			},
		}),
	}),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
	authApiSlice;
