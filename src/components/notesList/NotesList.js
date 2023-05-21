import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGetNotesQuery, useDeleteNoteMutation, useUpdateNoteMutation } from '../../api/apiSlice';
import { toggleModalEdit } from '../notesFilters/filterSlice';

import NotesListItem from '../notesListItem/NotesListItem';
import Spinner from '../spinner/Spinner';

import './notesList.css';

const NotesList = () => {
    const {
        data: notes = [],
        isLoading,
        isError,
    } = useGetNotesQuery();

    const dispatch = useDispatch();

    const [updateNote] = useUpdateNoteMutation();

    const [deleteNote] = useDeleteNoteMutation();

    const {activeFilter, term} = useSelector(state => state.filters);

    const onToggleCross = (id) => {
        notes.map(item => {
            if(item.id === id) {
                updateNote({...item, cross: !item.cross}).unwrap();
            }
        })
    }

    const onToggleEdit = (id) => {
        notes.map(item => {
            if(item.id === id) {
                dispatch(toggleModalEdit({...item}))
            }
        })
    }

    const filteredNotes = useMemo(() => {
        const filteredNotes = notes.slice();

        if (term.length === 0 && activeFilter === 'All') {
            return filteredNotes;
        } else if (activeFilter === 'All') {
            let visibleData = filteredNotes.filter(item => {
                    return item.title.indexOf(term) > -1
                })
            return visibleData;
        } else {
            let visibleData = filteredNotes.filter(item => {
                return item.title.indexOf(term) > -1
            })
            return visibleData.filter(item => item.color === activeFilter);
        }
    }, [notes, activeFilter, term]);

    const onDelete = useCallback((id) => {
        deleteNote(id);
    }, []);

    if (isLoading) {
        return <Spinner/>
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (notes.length === 0) {
            return (
                <div className="noNotesWrapper">
                    <h2>You don't have any notes</h2>
                    <div className="noNotes_bg"></div>
                </div>
            )
        } else if (arr.length === 0) {
            return (
                <div className="noNotesSearchWrapper">
                    <h2>Couldn't find any notes</h2>
                    <div className="noNotesSearch_bg"></div>
                </div>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <NotesListItem 
                    key={id} {...props} 
                    onDelete={() => onDelete(id)} 
                    onToggleCross={() => onToggleCross(id)} 
                    onToggleEdit={() => onToggleEdit(id)}/>
            )
        })
    }

    const elements = renderHeroesList(filteredNotes);
    return (
        <div className="notes_wrapper">
            {elements}
        </div>
    )
}

export default NotesList;