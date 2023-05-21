import './notesListItem.css';

const NotesListItem = ({title, description, color, cross, onDelete, date, onToggleCross, onToggleEdit}) => {
    let classNames = 'notes_box',
        pencilColor = 'notes_box_icon_pencil', 
        trashColor = 'notes_box_icon_trash',
        checkboxBugFix = '';

    if (color === 'Home') {
        classNames += ' Home';
        pencilColor += ' Home';
        trashColor += ' Home';
    } else if (color === 'Work') {
        classNames += ' Work';
        pencilColor += ' Work';
        trashColor += ' Work';
    } else if (color === 'Personal') {
        classNames += ' Personal';
        pencilColor += ' Personal';
        trashColor += ' Personal';
    }

    if(cross) {
        classNames += ' cross';
        pencilColor += ' cross';
        trashColor += ' cross';
        checkboxBugFix = true
    }

    const descrStr = description.length > 220 ? description.slice(0, 220) + '...' : description;

    return (
        <div className={classNames}>
            <div className="notes_box_top">
                <input checked={checkboxBugFix} onChange={onToggleCross} type="checkbox" className="notes_box_checkbox form-check-input"></input>
                <div className="notes_box_title">{title}</div>
                    <button
                        type='button'
                        className={pencilColor}
                        onClick={onToggleEdit}>
                        <i className='fas fa-pencil'></i>
                    </button>
                    <button
                        type='button'
                        className={trashColor}
                        onClick={onDelete}>
                             <i className='fas fa-trash'></i>
                    </button>
            </div>
            <div className="notes_box_descr">{descrStr}</div>
            <div className="notes_box_date">{date}</div>
        </div>
    );
}

export default NotesListItem;