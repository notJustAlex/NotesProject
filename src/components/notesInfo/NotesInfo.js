import { useGetNotesQuery } from '../../api/apiSlice';
import Spinner from "../spinner/Spinner";

import './notesInfo.css';

const NotesInfo = () => {
    const {
        data: notes = [],
        isLoading,
        isError,
    } = useGetNotesQuery();

    if (isLoading) {
        return <Spinner/>
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    let count = notes.length;
    let doneNotes = notes.filter(item => item.cross).length;

    let line = (doneNotes / count)*100;
    let str = '';
    let ActivStr = 'app_info';

    if (line === 100) {
        str = `You have completed all notes`
    } else {
        str = `You have ${doneNotes}/${count} notes completed`
    }

    if (count > 0) {
        ActivStr +=' activ';
    }

    return (
        <div className={ActivStr}>
            <h2>{str}</h2>
            <div className="app_info_divider" style={{width: `${line}%`}}>
                <div className='app_info_divider_full'></div>
            </div>
        </div>
    );
}

export default NotesInfo;