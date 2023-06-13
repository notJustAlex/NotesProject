import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store/store';

import { selectAll, toggleModalEdit } from '../notesFilters/filterSlice';
import { useUpdateNoteMutation } from '../../api/apiSlice';



const NotesEditForm = () => {
    const dispatch = useDispatch();

    const {editNote} = useSelector(state => state.filters);

    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescr, setNoteDescr] = useState('');
    const [noteColor, setNoteColor] = useState('');

    const [updateNote] = useUpdateNoteMutation();

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    useEffect(() => {
        setNoteTitle(editNote.title);
        setNoteDescr(editNote.description);
        setNoteColor(editNote.color);
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(!noteTitle) {
            document.getElementById('add_title').classList.add('red');
            return;
        } else if(!noteColor) {
            document.getElementById('dropbtn').classList.add('red');
            return;
        }

        updateNote({...editNote, title: noteTitle, description: noteDescr, color: noteColor}).unwrap();

        dispatch(toggleModalEdit());
        
        setNoteTitle('');
        setNoteDescr('');
        setNoteColor('');
        document.getElementById('add_title').classList.remove('red');
        document.getElementById('dropbtn').classList.remove('red');
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name}) => {
                if (name === 'All')  return;

                return <button type='button' value={noteColor} onClick={(e) => setNoteColor(e.target.name)} key={name} name={name}>{name}</button>
            })
        }
    }

    let currentColor = 'Select Category';

    if (noteColor === 'Home') {
        currentColor = 'Home';
    } else if (noteColor === 'Work') {
        currentColor = 'Work';
    } else if (noteColor === 'Personal') {
        currentColor = 'Personal';
    }

    return (
        <>
        <div className='modal-backdrop'></div>
        <form 
            className='add_window'
            onSubmit = {onSubmitHandler}> 
                <h2 className="add_window_title">Edit note</h2>
                <div className="add_divider"></div>
                <div className="add_title_dropdown">
                    <input 
                        type="text" 
                        className="add_title"
                        placeholder="Add title..."
                        name="title"
                        id='add_title'
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}>
                    </input>
                    <div className="add_dropdown">
                        <div className="propbtn_wrapper">
                            <button className="dropbtn" id='dropbtn'>{currentColor}</button>
                            <i className='fa fa-caret-down'></i>
                        </div>
                        <div className="dropdown_content">
                            {renderFilters(filters, filtersLoadingStatus)}
                        </div>
                    </div>
                </div>

                <textarea 
                    cols="30" rows="10"
                    className="add_descr"
                    placeholder="Add description..."
                    name="descr"
                    id='add_descr'
                    value={noteDescr}
                        onChange={(e) => setNoteDescr(e.target.value)}>
                </textarea>

                <button 
                type='button'
                    className="add_cancel"
                    onClick={() => dispatch(toggleModalEdit())}>
                        CANCEL
                </button>
                <button 
                    className="add_add" 
                    type='submit'>
                        EDIT
                </button>
        </form>
        </>
    )
}

export default NotesEditForm;