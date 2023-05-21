import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';

import { filtersChanged, fetchFilters, selectAll, termChanged, toggleModalAdd } from './filterSlice';
import Spinner from '../spinner/Spinner';

import './notesFilters.css';

const NotesFilters = () => {
    const {filtersLoadingStatus, activeFilter, term} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();
    
    useEffect(() => {
        dispatch(fetchFilters(request));
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({id, name, className}) => {

            const btnClass = id === activeFilter ? `btn btn-primary ${id}` : `btn ${className} ${id}`
            
            return (
                <div className={`button_wrapper`} key={`containerOf${id}`}>
                        <button 
                            className={btnClass}
                            type='button'
                            key={name}
                            onClick={() => dispatch(filtersChanged(id))}>
                                {name}
                        </button>
                        <div className={`dot ${id}`}></div>
                    </div>
            )
        })
    }

    const buttons = renderFilters(filters);
    return (
        <>
            <div className='search'>
                <i className='fa fa-search'></i>
                <input 
                type="text" 
                className='form-control search-input'
                value={term}
                onChange={(e) => dispatch(termChanged(e.target.value))}
                placeholder='Search notes...'/>
            </div>
            <div className="btn-group">
                <div className="notes_filter_nav" key='notes_filter_nav'>
                    {buttons}
                </div>

                <div className='notes_add_button' key='notes_add_button'>
                    <button 
                        className="btn notes_add"
                        type='button'
                        key='addButoon'
                        onClick={() => dispatch(toggleModalAdd())}>
                            <div className="notes_new_plus" key='plus'></div>
                            Add Note
                    </button>
                    </div>
            </div>
        </>
    );
}

export default NotesFilters;