import { useGetNotesQuery } from "./notesApiSlice";
import { useMemo, useState, useEffect } from "react";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import NotesFilter from "./NotesFilter/NotesFilter";
import { INote } from "../../shared/interfaces/note.interface";

import { useDispatch } from "react-redux";
import { setError, setLoading } from "../statusHandler/statusHandlerSlice";

import { ReactComponent as NoNotes } from "../../shared/icons/add-note-illustration.svg";
import { ReactComponent as NoFiltredNotes } from "../../shared/icons/search-image.svg";

import "./notes.css";

const NotesList = () => {
	const { id } = useAuth();

	const [term, setTerm] = useState("");
	const [filter, setFilter] = useState("All");

	const dispatch = useDispatch();

	const [userNotes, setUserNotes] = useState<INote[]>([]);

	const {
		data: notes,
		isLoading,
		isSuccess,
		isError,
	} = useGetNotesQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});

	useEffect(() => {
		dispatch(setLoading(isLoading));
		dispatch(setError(isError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);

	const getFilters = (activeFilter: string, term: string) => {
		setFilter(activeFilter);
		setTerm(term);
	};

	const filteredNotes = useMemo(() => {
		if (isSuccess) {
			const { entities }: any = notes;

			let userNotes: INote[] = [];

			for (let note in entities) {
				if (entities[note].user === id) userNotes.push(entities[note]);
			}

			setUserNotes(userNotes);

			let visibleData = userNotes.filter((item: INote) => {
				return (
					item.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >
						-1 ||
					item.description
						.toLocaleLowerCase()
						.indexOf(term.toLocaleLowerCase()) > -1
				);
			});

			return filter === "All"
				? visibleData
				: visibleData.filter((item: INote) => item.category === filter);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notes, term, filter]);

	const renderList = (arr: INote[] | undefined) => {
		if (arr && isSuccess) {
			if (userNotes.length === 0) {
				return (
					<div className="no_notes_wrapper">
						<h2>You don't have any notes</h2>
						<NoNotes />
					</div>
				);
			} else if (arr?.length === 0) {
				return (
					<div className="dont_find_notes_wrapper">
						<h2>Couldn't find any notes</h2>
						<NoFiltredNotes />
					</div>
				);
			}

			return (
				<div className="noteslist_content">
					{arr?.map((note: INote) => (
						<Note key={note._id} noteId={note.id as string} />
					))}
				</div>
			);
		}
	};

	let content = renderList(filteredNotes);
	return (
		<section className="noteslist">
			<NotesFilter sendFilters={getFilters} />
			{content}
		</section>
	);
};

export default NotesList;
