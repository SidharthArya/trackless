import { useContext, useState, useEffect } from 'preact/hooks';
// import React from 'preact';
import BaseLayout from '../../layouts/BaseLayout'
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import dayjs from 'dayjs';
import { Checkbox } from 'antd';
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Table from '@editorjs/table'; 
import Link from '@editorjs/link'; 
import Embed from '@editorjs/embed'; 
import CodeTool from '@editorjs/code';
import NoteEditor from '../../components/NoteEditor';




const TaskList = (props) => {
    const {user} = useContext(UserContext);

    return (

        <BaseLayout {...props}>
            <NoteEditor/>
        </BaseLayout>
    )

}

export default TaskList;