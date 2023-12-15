import {
	createSelector,
	createEntityAdapter,
	EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { IImage } from "../../shared/interfaces/images.interface";

const imagesAdapter = createEntityAdapter<IImage>({});

const initialState = imagesAdapter.getInitialState();

export const imagesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getImages: builder.query<IImage[], void>({
			query: () => ({
				url: "/images",
				validateStatus: (response: Response, result: IImage[] | any) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (
				responseData: IImage[]
			): IImage[] | Promise<IImage[]> => {
				const loadedImages: IImage[] = responseData.map((image: IImage) => {
					image.id = image._id;
					return image;
				});
				// @ts-ignore
				return imagesAdapter.setAll(initialState, loadedImages);
			},
			providesTags: (result: any, _error, _arg) => {
				if (result?.ids) {
					return [
						{ type: "Image", id: "LIST" },
						...result.ids.map((id: string) => ({ type: "Image", id })),
					];
				} else return [{ type: "Image", id: "LIST" }];
			},
		}),
		sendImage: builder.mutation({
			query: (initialNote) => ({
				url: "/images",
				method: "PATCH",
				body: {
					...initialNote,
				},
			}),
		}),
		deleteImage: builder.mutation<void, { id: string }>({
			query: ({ id }) => ({
				url: `/images`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (_result, _error, arg: { id: string }) => [
				{ type: "Image", id: arg.id },
			],
		}),
	}),
});

export const {
	useGetImagesQuery,
	useSendImageMutation,
	useDeleteImageMutation,
} = imagesApiSlice;

export const selectImagesResult = imagesApiSlice.endpoints.getImages.select();

const selectImagesData: any = createSelector(
	selectImagesResult,
	(imagesResult) => imagesResult.data
);

export const {
	selectAll: selectAllImages,
	selectById: selectImagesById,
	selectIds: selectImageIds,
} = imagesAdapter.getSelectors(
	(state: EntityState<IImage> | IImage): EntityState<IImage> =>
		selectImagesData(state) ?? initialState
);
