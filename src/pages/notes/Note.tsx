import { useState } from 'preact/hooks';
import NoteEditor from '../../components/NoteEditor';
import BaseLayout from '../../layouts/BaseLayout';
const Note = (props) => {
    const [now] = useState(props.id ? props.id : new Date());
return (
    <BaseLayout {...props}>
    <NoteEditor {...{now: now}} />
        </BaseLayout>
)
}

export default Note;