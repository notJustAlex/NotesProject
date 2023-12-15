import { useState, useEffect } from "react";
import { setNewNoteModal } from "../../statusHandler/statusHandlerSlice";
import { useDispatch } from "react-redux";

import { DropdownMenu, NavItem } from "../../../components/Dropdown/Dropdown";

import { ReactComponent as Caret } from "../../../shared/icons/caret.svg";
import { ReactComponent as LoupeIcon } from "../../../shared/icons/magnifying-glass.svg";

import "./notesFilter.css";

interface INotesFilterProps {
	sendFilters: (activeFilter: string, term: string) => void;
}

const NotesFilter = ({ sendFilters }: INotesFilterProps) => {
	const dispatch = useDispatch();

	const [term, setTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState("All");
	const navButtons = ["All", "Personal", "Home", "Business"];

	useEffect(() => {
		sendFilters(activeFilter, term);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFilter, term]);

	const renderFilters = () => {
		return navButtons.map((button: string) => {
			const btnClass =
				activeFilter !== button
					? "noteslist_nav_button"
					: "noteslist_nav_button active";

			return (
				<button
					className={btnClass}
					key={button}
					id={`${button}`}
					onClick={() => setActiveFilter(button)}
					type="button"
				>
					{button}
				</button>
			);
		});
	};

	return (
		<>
			<header className="noteslist_header">
				<div className="search_wrapper">
					<LoupeIcon />
					<input
						className="noteslist_search"
						type="text"
						placeholder="Search"
						onChange={(e) => setTerm(e.target.value)}
					/>
				</div>
				<button
					className="noteslist_add_button"
					onClick={() => dispatch(setNewNoteModal(true))}
				>
					<div className="noteslist_plus" key="plus" />
					Add
				</button>

				<NavItem icon={<Caret />}>
					<DropdownMenu></DropdownMenu>
				</NavItem>
			</header>

			<div className="noteslist_nav">
				<h2 className="noteslist_title">Your notes</h2>
				{renderFilters()}
			</div>
		</>
	);
};

export default NotesFilter;
