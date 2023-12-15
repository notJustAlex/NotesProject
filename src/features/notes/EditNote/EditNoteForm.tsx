import { INote } from "../../../shared/interfaces/note.interface";
import { useUpdateNoteMutation } from "../notesApiSlice";
import { useState, useEffect, MouseEvent } from "react";
import { CSSTransition } from "react-transition-group";
import {
	setEditNote,
	setError,
	setLoading,
} from "../../statusHandler/statusHandlerSlice";
import { useDispatch } from "react-redux";

import { ReactComponent as CaretDropdownIcon } from "../../../shared/icons/caret.svg";

import "../NewNote/newNote.css";

interface IEditNoteProps {
	note: INote;
}

const EditNoteForm = ({ note }: IEditNoteProps) => {
	const dispatch = useDispatch();

	const filterOptions = ["Personal", "Home", "Business"];

	const [updateNote, { isLoading, isSuccess, isError }] =
		useUpdateNoteMutation();

	const [title, setTitle] = useState(note.title);
	const [description, setDescription] = useState(note.description);
	const [category, setCategory] = useState(note.category);

	useEffect(() => {
		if (isSuccess) {
			setTitle("");
			setDescription("");
			setCategory("");
			dispatch(setEditNote(""));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	const canSave =
		[
			title,
			description,
			category,
			note.title !== title ||
				note.category !== category ||
				note.description !== description,
		].every(Boolean) && !isLoading;

	const onSaveNoteClicked = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (canSave) {
			await updateNote({
				user: note.user,
				id: note.id,
				title,
				description,
				category,
				completed: note.completed,
			}).then(() => dispatch(setEditNote("")));
		}
	};

	const renderDropdownContent = (): JSX.Element[] => {
		return filterOptions.map((filter: string) => {
			return (
				<button
					type="button"
					value={filter}
					onClick={() => setCategory(filter)}
					key={filter}
				>
					{filter}
				</button>
			);
		});
	};

	return (
		<>
			<div
				className="modal_blur"
				onClick={() => dispatch(setEditNote(""))}
			></div>

			<div className="note_form">
				<div className="title">Edit Note</div>
				<div className="divider"></div>

				<div className="text_wrapper">
					<span>Title</span>
					<input
						className="form_input_title"
						type="text"
						autoComplete="off"
						placeholder="Add title..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className="dropdown_wrapper">
					<span className="dropdown_title">Category</span>
					<div className="dropdown">
						<div className="wrapper">
							<button className="dropdown_button" type="button">
								<div>
									{category !== "" && <span>Select Category</span>}
									{category === "" ? (
										<span
											style={{
												fontSize: "15px",
												opacity: "1",
											}}
										>
											Select Category
										</span>
									) : (
										category
									)}
								</div>
							</button>
							<CSSTransition timeout={200}>
								<CaretDropdownIcon />
							</CSSTransition>
						</div>
						<div className="dropdown_content">{renderDropdownContent()}</div>
					</div>
				</div>

				<div className="text_wrapper">
					<span>Description</span>
					<textarea
						className="description"
						placeholder="Add description..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="buttons">
					<button
						className="cancel"
						title="Cancel"
						type="button"
						onClick={() => dispatch(setEditNote(""))}
					>
						Cancel
					</button>
					<button
						className="submit"
						title="Save"
						type="submit"
						disabled={!canSave}
						onClick={onSaveNoteClicked}
					>
						Edit
					</button>
				</div>
			</div>
		</>
	);
};

export default EditNoteForm;
