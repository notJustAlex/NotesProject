import { apiSlice } from "../../app/api/apiSlice";

interface IMailer {
	recipient: string;
	subject: string;
	structure: string;
}

export const mailerApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendMail: builder.mutation({
			query: (initialMailData: IMailer) => ({
				url: "/mailer",
				method: "POST",
				body: {
					...initialMailData,
				},
			}),
		}),
	}),
});

export const { useSendMailMutation } = mailerApiSlice;
