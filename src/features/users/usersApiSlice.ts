import {
	createSelector,
	createEntityAdapter,
	EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../../shared/interfaces/user.interface";

const usersAdapter = createEntityAdapter<IUser>({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<IUser[], void>({
			query: () => ({
				url: "/users",
				validateStatus: (response: Response, result: IUser[] | any) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData: IUser[]): IUser[] | any => {
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result: any, _error, _arg) => {
				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id: any) => ({ type: "User", id })),
					];
				} else return [{ type: "User", id: "LIST" }];
			},
		}),
		addNewUser: builder.mutation({
			query: (initialUserData: IUser) => ({
				url: "/users",
				method: "POST",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: (initialUserData: IUser) => ({
				url: "/users",
				method: "PATCH",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => ({
				url: `/users`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useAddNewUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData: any = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data
);

export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
} = usersAdapter.getSelectors(
	(state: EntityState<IUser>): EntityState<IUser> =>
		selectUsersData(state) ?? initialState
);
