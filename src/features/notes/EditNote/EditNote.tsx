import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "../notesApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../../statusHandler/statusHandlerSlice";
import useAuth from "../../../hooks/useAuth";
import { IAppState } from "../../../shared/interfaces/appState.interface";
import { CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import { INote } from "../../../shared/interfaces/note.interface";

const EditNote = () => {
	const { id } = useAuth();
	const dispatch = useDispatch();

	const editNote = useSelector(
		(state: IAppState) => state.statusHandler.editNote
	);

	const { note }: { note: INote } = useGetNotesQuery(undefined, {
		selectFromResult: ({ data }: any) => {
			const selectedNote = data?.ids?.find(
				(note: string) => data?.entities[note]?.id === editNote
			);
			return {
				note: selectedNote ? data?.entities[selectedNote] : null,
			};
		},
	});

	useEffect(() => {
		if (!note) {
			dispatch(setLoading(true));
		}

		if (note && note?.user !== id) {
			dispatch(setError(true));
		}

		dispatch(setError(false));
		dispatch(setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [note, id]);

	return note && editNote && note?.user === id ? (
		<CSSTransition in={!!editNote} unmountOnExit timeout={0}>
			<EditNoteForm note={note} />
		</CSSTransition>
	) : null;
};

export default EditNote;
