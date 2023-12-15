export interface IAppState {
	statusHandler: {
		isLoading: boolean;
		isError: boolean;
		isEmailModal: boolean;
		isNewNoteModal: boolean;
		editNote: string;
	};
}
