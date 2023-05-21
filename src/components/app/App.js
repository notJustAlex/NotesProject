import NotesFilters from '../notesFilters/notesFilters';
import NotesInfo from '../notesInfo/NotesInfo';
import NotesList from '../notesList/NotesList';
import NotesAddForm from '../notesAddForm/NotesAddFrom';
import NotesEditForm from '../notesEditForm/NotesEditForm';

import { useSelector } from 'react-redux';

import './app.css';

const App = () => {
    const {modalAdd, modalEdit} = useSelector(state => state.filters);

    return (
        <main className="app">
            <NotesFilters/>
            <NotesInfo/>
            <NotesList/>
            {modalAdd ? <NotesAddForm/> : null}
            {modalEdit ? <NotesEditForm/> : null}
        </main>
    )
}

export default App;