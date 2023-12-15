import { useDispatch } from "react-redux";
import { setLoading } from "../../statusHandler/statusHandlerSlice";
import { useGetUsersQuery } from "../../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";
import { useSelector } from "react-redux";
import { IAppState } from "../../../shared/interfaces/appState.interface";
import { CSSTransition } from "react-transition-group";
import { useRef, useEffect } from "react";

import "./newNote.css";

const NewNote = () => {
	const dispatch = useDispatch();
	const modalRef = useRef(null);

	const isNewNoteModal = useSelector(
		(state: IAppState) => state.statusHandler.isNewNoteModal
	);

	const { users } = useGetUsersQuery(undefined, {
		selectFromResult: ({ data }: any) => ({
			users: data?.ids.map((id: string) => data?.entities[id]),
		}),
	});

	useEffect(() => {
		if (!users?.length) {
			dispatch(setLoading(true));
		}

		return () => {
			dispatch(setLoading(false));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	return (
		<CSSTransition
			in={isNewNoteModal}
			unmountOnExit
			timeout={0}
			nodeRef={modalRef}
		>
			<NewNoteForm users={users} />
		</CSSTransition>
	);
};

export default NewNote;
