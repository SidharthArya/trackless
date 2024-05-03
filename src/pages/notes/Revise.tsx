import { useContext, useEffect, useState } from 'preact/hooks';
import NoteEditor from '../../components/NoteEditor';
import BaseLayout from '../../layouts/BaseLayout';
import { getDocumentsAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
const Revise = (props) => {
    const [revisables, setRevisables] = useState([]);
    const [notes, setNotes] = useState([]);

    const user = useContext(UserContext);
    useEffect(()=>{
        getDocumentsAsync(user, 'data', 'notes/*/blocks', [setRevisables], false, -1, [],undefined, [["revise","==", "true"] ])

    }, [revisables.length])
return (
    <BaseLayout {...props}>

        </BaseLayout>
)
}

export default Revise;