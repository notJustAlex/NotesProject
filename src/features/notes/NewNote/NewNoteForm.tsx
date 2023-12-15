import { useState, useEffect, MouseEvent } from "react";
import { useAddNewNoteMutation } from "../notesApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { IUser } from "../../../shared/interfaces/user.interface";
import { INote } from "../../../shared/interfaces/note.interface";
import { CSSTransition } from "react-transition-group";
import { useDispatch } from "react-redux";
import {
	setError,
	setLoading,
	setNewNoteModal,
} from "../../statusHandler/statusHandlerSlice";

import { ReactComponent as CaretDropdownIcon } from "../../../shared/icons/caret.svg";

interface INewNoteProps {
	users: IUser[];
}

const NewNoteForm = ({ users }: INewNoteProps) => {
	const dispatch = useDispatch();
	const { id } = useAuth();
	const filterOptions = ["Personal", "Home", "Business"];

	const [addNewNote, { isLoading, isSuccess, isError }] =
		useAddNewNoteMutation();

	const navigate = useNavigate();

	const [user, setUser] = useState<IUser>();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");

	useEffect(() => {
		if (isSuccess) {
			setTitle("");
			setDescription("");
			setCategory("");
			dispatch(setNewNoteModal(false));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, navigate]);

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	useEffect(() => {
		if (id) {
			const user: IUser | undefined = users.find((user: IUser) => {
				return user.id === id;
			});

			if (user) setUser(user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

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

	const canSave =
		[title, description, category !== ""].every(Boolean) && !isLoading;

	const onSaveNoteClicked = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (canSave && user?._id) {
			const updateNote: INote = {
				user: user?._id,
				title,
				description,
				category,
			};
			await addNewNote(updateNote);
		}
	};

	return (
		<>
			<div
				className="modal_blur"
				onClick={() => dispatch(setNewNoteModal(false))}
			></div>

			<div className="note_form">
				<div className="title">Add Note</div>
				<div className="divider"></div>

				<div className="text_wrapper">
					<span>Title</span>
					<input
						className="title"
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
						onClick={() => dispatch(setNewNoteModal(false))}
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
						Add
					</button>
				</div>
			</div>
		</>
	);
};

export default NewNoteForm;
