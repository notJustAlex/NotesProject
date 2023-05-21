import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store/store';

import { selectAll, toggleModalAdd } from '../notesFilters/filterSlice';
import { useCreateNoteMutation } from '../../api/apiSlice';

import './notesAddForm.css';

const NotesAddForm = () => {
    const dispatch = useDispatch();

    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescr, setNoteDescr] = useState('');
    const [noteColor, setNoteColor] = useState('');

    const [createNote] = useCreateNoteMutation();

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(!noteTitle) {
            document.querySelector('.add_title').classList.add('red');
            return;
        } else if(!noteDescr) {
            document.querySelector('.add_descr').classList.add('red');
            return;
        } if(!noteColor) {
            document.querySelector('.dropbtn').classList.add('red');
            return;
        }

        const newNote = {
            id: uuidv4,
            title: noteTitle,
            description: noteDescr,
            color: noteColor,
            cross: false,
            date: getDate()
        }

        createNote(newNote).unwrap();

        dispatch(toggleModalAdd());
        
        setNoteTitle('');
        setNoteDescr('');
        setNoteColor('');
        document.querySelector('.add_title').classList.remove('red');
        document.querySelector('.add_descr').classList.remove('red');
        document.querySelector('.dropbtn').classList.remove('red');
    }

    const  getDate = () => {
        let date = new Date();
        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let d = date.getDate();
        let m = month[date.getMonth()];
        let y = date.getFullYear();

        let dateStr = (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
        return dateStr;
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
                <h2 className="add_window_title">Add note</h2>
                <div className="add_divider"></div>
                <div className="add_title_dropdown">
                    <input 
                        type="text" 
                        className="add_title"
                        placeholder="Add title..."
                        name="title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}>
                    </input>
                    <div className="add_dropdown">
                        <div className="propbtn_wrapper">
                            <button className="dropbtn">{currentColor}</button>
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
                    value={noteDescr}
                        onChange={(e) => setNoteDescr(e.target.value)}>
                </textarea>

                <button 
                type='button'
                    className="add_cancel"
                    onClick={() => dispatch(toggleModalAdd())}>
                        CANCEL
                </button>
                <button 
                    className="add_add" 
                    type='submit'>
                        ADD
                </button>
        </form>
        </>
    )
}

export default NotesAddForm;