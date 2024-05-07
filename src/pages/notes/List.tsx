import { useContext, useState, useEffect } from 'preact/hooks';
// import React from 'preact';
import BaseLayout from '../../layouts/BaseLayout'
import {FloatButton, Table,Radio, Select,Button, Dropdown, Input, theme, Form, TableColumnType, DatePicker, Tag,} from 'antd';
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import dayjs from 'dayjs';
import { Checkbox } from 'antd';
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import NoteEditor from '../../components/NoteEditor';
import Fuse from 'fuse.js';
import TagFilter from '../../components/TagFilter';
import {useSignal} from '@preact/signals';

const TaskParameters = {
    'name': {type: 'string', required: true},
    'description': {type: 'string', required: false},
    'due': {type: 'datetime', required: false},
    'scheduled': {type: 'datetime', required: false},
    'parent': {type:'string', required: false}
}

// interface DataType {
//     key: React.Key;
//     name: string;
//     description: string;
//     version: string;
//     upgradeNum: number;
//     creator: string;
//     createdAt: string;
//   }

const fieldStyle = {
    background: 'none',
    border: 'none',
    borderRadius: 0,
}


const TaskList = (props) => {
    const {user} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const tags = useSignal({});
    const [tagOpt, setTagOpt] = useState([]);
    const [hideTags, setHideTags] = useState(props.hidetags ? props.hidetags : false);
    const [states, setStates] = useState({});
    const [statesM, setStatesM] = useState({});
    const [floatB, setFloatB] = useState(false);
    const [taskFilter, setTaskFilter ] = useState([]);
    const [stateFilter, setStateFilter] = useState(props.state ? props.state : '');
    const tagsFilter = useSignal(props.tag ? props.tag : '');
    const [newform] = Form.useForm();
    const [editorId, setEditorId] = useState('');
    const [fuse, setFuse] = useState(new Fuse([], {keys: ['name', 'description', 'tags']}));
    const [searchFilter, setSearchFilter] = useState("");


    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
      } = theme.useToken();

    const handleKeyDown = (e, record) => {
            const field = e.target.name
            const value =  e.target.value;
            const data = {};
            data[field] = value;
            console.log(record)
            updateDocumentAsync(user, 'data', 'notes/' + record.id, data)
      };
    const handleGetState = (v,record, e) => {
        if (v == 'DELETE')
            deleteDocumentAsync(user, 'data', 'notes/' + record.id)
        else
            updateDocumentAsync(user, 'data', 'notes/' + record.id, {state: v})
    };
    const spawnEditor = (id) => {
        setEditorId(id);
    }
    const columns = [
        {
            title: '',
            dataIndex: 'state',
            key: 'state',
            sorter: (a, b) => a.name.length - b.name.length,
            filters: [
                { text: 'TODO', value: 'TODO' },
                { text: 'DONE', value: 'DONE' },
              ],
            onFilter: (value: string, record) => record.state === value,
            render: (text, record) => <Select
            optionLabelProp="label"
            placeholder="State"
            value={text}
            style={{border: 'none', background: 'none', borderRadius: 'none', width: '100%'}}
            onChange={(v, e)=> handleGetState(v, record, e)}
          >
            <Select.Option value=''> <Tag color='#000'>0</Tag></Select.Option>
              {Object.keys(states).map((t)=> states[t] && states[t].color &&  <Select.Option value={t}> <Tag color={states[t].color}>{t}</Tag></Select.Option> || <Select.Option value={t}> <Tag color={states[t].color}>{t}</Tag></Select.Option>)}
              <Select.Option value='DELETE'> <Tag color='#f00'>DELETE</Tag></Select.Option>
      
      </Select>
            }
          ,
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
          
          key: 'name',
          render: (text, record) => {
            return (<span onClick={()=> spawnEditor(record.id)}>{text}</span>)

          }
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            sorter: (a, b) => a.name.length - b.name.length,
            key: 'tags',
            render: (text, record) =>{ 
                let seed = 0;
                if (text)
                return text.map((t)=> {
                    if(tags.value[t] && tags.value[t].color)
                    return <Tag color={tags.value[t].color}>{t}</Tag>
                    return <Tag color="#000">{t}</Tag>
            })
        }
          },
      ]; 
      const handleNewTask = (e) => {
        const form = document.getElementById('newform');
        let data = {};
        const collection = form.getElementsByTagName('input');

        for (let i=0; i < collection.length; i++){
            if(collection[i].name)
                if(collection[i].value)
                    data[collection[i].name] = collection[i].value;
                // else
                    // data[collection[i].name] = '';

        }
        if (data.tags)
        data.tags = data.tags.split(',');
        if (!data.state) data.state = 'TODO'
    let date = new Date();
        if (data.due) data.due = dayjs(data.due).toDate()
        if (data.scheduled) data.scheduled = dayjs(data.scheduled).toDate()
    
    setDocumentAsync(user, 'data', 'notes/' + date.getTime().toString(), data)
        console.log(data);
    }
    const newTaskForm = (e) => {
        if (!document.getElementById('newform')) {console.log(document.getElementById('newform')); return;}
        if (document.getElementById('newform').style.display == 'none')
            document.getElementById('newform').style.display = "block";
        else document.getElementById('newform').style.display = 'none';
    }
    const handleNewGetTags = (val) => {
        console.log('Here')
        const form = document.getElementById('newform');
        const collection = form.getElementsByTagName('input');
        for (let i = 0; i < collection.length; i++)
            if(collection[i].name == 'tags')
                collection[i].value = val.join();
    }
    const handleNewGetState = (val) => {
        const form = document.getElementById('newform');
        const collection = form.getElementsByTagName('input');
        for (let i = 0; i < collection.length; i++)
            if(collection[i].name == 'state'){
                collection[i].value = val;
            console.log("State",collection[i].value )
            
            }
            }
    const setFilteredTasks_n = (docs) => {
        console.log(docs);
        let docs_o = docs;
        docs = docs.map((doc)=> {
            doc.name = doc.title.text;
            return doc;
        })
        let data = [];
        
        console.log(stateFilter, tagsFilter)
        if (stateFilter.length)
            docs = docs.filter((doc) => stateFilter.length && doc.state === stateFilter )
        if (tagsFilter.value.length)
            docs = docs.filter((doc) => tagsFilter.value.length && doc.tags && doc.tags.includes(tagsFilter.value) )
        fuse.setCollection(docs);
        if (searchFilter && searchFilter.length > 1)
            docs = fuse?.search(searchFilter).map((d)=> d.item);
        setFilteredTasks(docs)
        return docs_o;
    }
    useEffect(()=>{
        getDocumentsAsync(user, 'data', 'notes', [setFilteredTasks_n,setTasks], false, -1, [],null, [["state", "!=", "ARCHIVE"]])
    }, [tasks.length])
    useEffect(()=>{
        getDocumentsAsync(user, 'settings', 'notes/meta/states', [(docs)=>{
            let dd = {};
            let opt = [];
            docs.map((d)=>{
                dd[d.id] = d;
                opt.push({key: d.id, label: d.id})
                
            });
            setStates(dd);
            setStatesM(opt)            
        }], false)
    }, [states.length])

    useEffect(()=>{
        setFilteredTasks_n([]);
        setTimeout(()=> setFilteredTasks_n(tasks), 1);
    //     const url = new URL(window.location.href);
    //     url.searchParams.set('state', stateFilter);
    //     url.searchParams.set('tag', tagsFilter);
    //     window.history.replaceState({}, '', url);
        
    }, [stateFilter, tagsFilter.value, searchFilter]);
    const handleNewNote = () => {
        setEditorId('new')
    }
    const makeFilters = () => {
        return (<>
  {props.hidetags || !hideTags && (
  <div>
  <Input onChange={(e)=> setSearchFilter(e.target.value)} placeholder="Search"/>
        <h4> Tags </h4>
        <TagFilter tags={tags} filter={tagsFilter} user={user}/>
  <br></br>
  </div>
  )}
  <br></br>
  </>
)


    }
    return (

        <BaseLayout {...props} filters={makeFilters()}>

            <Table dataSource={filteredTasks} columns={columns}/>
            <FloatButton icon={<PlusOutlined />} type="primary" onClick={handleNewNote}/>
 
    {editorId.length > 0 &&(
    <div id="editor-spawn" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'scroll', zIndex: 2}}>
        <div id="backdrop" onClick={()=> setEditorId('')} style={{position: 'fixed', background: '#000', width: '100%', height: '100vh', opacity: 0.5, zIndex: 3}}> </div>
    <div style={{position: 'relative', background: '#fff', maxWidth: 1280, zIndex: 100, borderRadius: 20, padding: 50, marginTop: 50, marginLeft: 'auto', marginRight:'auto', marginBottom: 0}}>

    <NoteEditor {...{now: editorId == "new"? undefined : editorId}} />
    </div>
    </div>
    )}
        </BaseLayout>
    )

}

export default TaskList;