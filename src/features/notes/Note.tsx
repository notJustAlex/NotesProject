import {
	useGetNotesQuery,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} from "./notesApiSlice";
import { memo, useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { INote } from "../../shared/interfaces/note.interface";

import { ReactComponent as TrashIcon } from "../../shared/icons/trash.svg";
import { ReactComponent as PencilIcon } from "../../shared/icons/pencil.svg";
import { useDispatch } from "react-redux";
import { setEditNote, setError } from "../statusHandler/statusHandlerSlice";

interface INoteProps {
	noteId: string;
}

const Note = ({ noteId }: INoteProps) => {
	const dispatch = useDispatch();

	const { note }: INote | any = useGetNotesQuery(undefined, {
		selectFromResult: ({ data }: INote | any) => ({
			note: data?.entities[noteId],
		}),
	});

	const [updateNote, { isLoading, isError }] = useUpdateNoteMutation();

	const [deleteNote, { isError: isDelError }] = useDeleteNoteMutation();

	const [completed, setCompleted] = useState<boolean>(note.completed);
	const prevCompleted = useRef(completed);

	useEffect(() => {
		if (prevCompleted.current !== completed) {
			onUpdateNote();
		}
		prevCompleted.current = completed;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [completed]);

	useEffect(() => {
		dispatch(setError(isError || isDelError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isError, isDelError]);

	const canSave = [note].every(Boolean) && !isLoading;

	const onUpdateNote = async () => {
		if (canSave) {
			await updateNote({
				id: note.id,
				user: note.user,
				title: note.title,
				description: note.description,
				category: note.category,
				completed: completed,
			});
		}
	};

	const onDeleteNoteClicked = async () => {
		await deleteNote({ id: note.id });
	};

	if (note) {
		return (
			<div
				className="note_wrapper"
				key={noteId}
				style={{
					backgroundColor: completed
						? "var(--bg-dark-gray-2)"
						: "var(--bg-white)",
				}}
			>
				<div className="note_top_wrapper">
					<div id={note.category} className="note_category">
						{note.category}
					</div>
					<div className="note_nav">
						<div className="checkbox_wrapper">
							<input
								className="note_checkbox"
								type="checkbox"
								checked={completed}
								onChange={() => setCompleted((prev: boolean) => !prev)}
								title="Completed"
							/>
						</div>
						<button
							className="note_button"
							type="button"
							onClick={() => dispatch(setEditNote(noteId))}
							title="Edit"
						>
							<PencilIcon />
						</button>
						<button
							className="note_button"
							type="button"
							onClick={onDeleteNoteClicked}
							title="Delete"
						>
							<TrashIcon />
						</button>
					</div>
				</div>
				<div
					className="note_title"
					style={{ textDecoration: completed ? "line-through" : "none" }}
				>
					{note.title}
				</div>
				<div
					className="note_description"
					style={{ textDecoration: completed ? "line-through" : "none" }}
				>
					{note.description}
				</div>
				<div className="note_date">
					{format(new Date(note.createdAt), "dd.MM.yyyy")}
				</div>
			</div>
		);
	} else return null;
};

const memoizedNote = memo(Note);

export default memoizedNote;
