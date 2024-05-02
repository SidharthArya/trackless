import { useContext, useState, useEffect } from 'preact/hooks';
import React from 'preact';
import BaseLayout from '../../layouts/BaseLayout'
import {FloatButton, Table,Radio, Select,Button, Dropdown, Input, theme, Form, TableColumnType, DatePicker, Tag} from 'antd';
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import dayjs from 'dayjs';
import Fuse from 'fuse.js';
import { Checkbox } from 'antd';
import AddButton from '../../components/AddButton';


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

const List = (props) => {
    const {user} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [fuse, setFuse] = useState(new Fuse([], {keys: ['text', 'author']}));
    const [searchFilter, setSearchFilter] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [tags, setTags] = useState({});
    const [tagOpt, setTagOpt] = useState([]);
    const [hideTags, setHideTags] = useState(props.hidetags ? props.hidetags : false);
    const [states, setStates] = useState({});
    const [statesM, setStatesM] = useState({});
    const [floatB, setFloatB] = useState(false);
    const [taskFilter, setTaskFilter ] = useState([]);
    const [stateFilter, setStateFilter] = useState(props.state ? props.state : 'TODO');
    const [tagsFilter, setTagsFilter] = useState(props.tag ? props.tag : '');
    const [newform] = Form.useForm();
    
    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
      } = theme.useToken();

    const handleKeyDown = (e, record) => {
            const field = e.target.name
            const value =  e.target.value;
            const data = {};
            data[field] = value;
            console.log(record)
            updateDocumentAsync(user, 'data', 'quotes/' + record.id, data)
      };
    const handleGetState = (v,record, e) => {
        if (v == 'DELETE')
            deleteDocumentAsync(user, 'data', 'quotes/' + record.id)
        else
            updateDocumentAsync(user, 'data', 'quotes/' + record.id, {state: v})
    };
    const columns = [
        {
          title: 'Text',
          dataIndex: 'text',
          sorter: (a, b) => a.name.length - b.name.length,
          
          key: 'text',
          render: (text, record) => {
            return (<Input style={fieldStyle} label='Text' name='text' type='text' onKeyDown={(e)=> (e.key === "Enter") && handleKeyDown(e, record)} defaultValue={text} />)

          }
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: (a, b) => a.name.length - b.name.length,
            
            key: 'author',
            render: (text, record) => {
              return (<Input style={fieldStyle} label='Author' name='author' type='author' onKeyDown={(e)=> (e.key === "Enter") && handleKeyDown(e, record)} defaultValue={text} />)
  
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
    
    setDocumentAsync(user, 'data', 'quotes/' + date.getTime().toString(), data)
        console.log(data);
    }
    const newTaskForm = (e) => {
        if (!document.getElementById('newform')) {console.log(document.getElementById('newform')); return;}
        if (document.getElementById('newform').style.zIndex == '-1'){
            document.getElementById('floatbutton').style.transform = "rotateZ(225deg)";
            document.getElementById('floatbutton').children[0].style.backgroundColor = "#eeeeee";
            document.getElementById('floatbutton').children[0].children[0].children[0].style.color = "#555555";
            document.getElementById('addbutton').children[0].style.backgroundColor = "#167ff";
            document.getElementById('addbutton').children[0].children[0].children[0].style.color = "#ffffff";
            document.getElementById('newform').style.zIndex = "1";
            document.getElementById('newform').style.opacity = 1;
            document.getElementById('newform').style.transform = 'translateY(0)';

        }
        else {
            document.getElementById('floatbutton').style.transform = "rotateZ(0deg)";
            document.getElementById('addbutton').children[0].style.backgroundColor = "#eeeeee";
            document.getElementById('addbutton').children[0].children[0].children[0].style.color = "#555555";
        
            document.getElementById('floatbutton').children[0].style.backgroundColor = "#1677ff";
            document.getElementById('floatbutton').children[0].children[0].children[0].style.color = "#fff";
            document.getElementById('newform').style.zIndex = '-1';
            document.getElementById('newform').style.transform = 'translateY(100%)';
            document.getElementById('newform').style.opacity = 0;
        }
    }


    useEffect(()=>{
        getDocumentsAsync(user, 'data', 'quotes', [setTasks], false)
        console.log(tasks)
    }, [tasks.length])
    useEffect(()=>{
        if (tasks.length) {
        fuse.setCollection(tasks);
        setFilteredTasks(tasks);
        }
    }, [tasks])
    useEffect(()=>{
        console.log('Here')
        setFilteredTasks([])

        if (searchFilter && searchFilter.length > 1){
        setTimeout(()=> setFilteredTasks(fuse?.search(searchFilter).map((d)=> d.item)), 500)
        }
        else {
            console.log('Here2')
        setTimeout(()=> setFilteredTasks(tasks), 500)
        }
    }, [searchFilter, tasks])
    
    return (

        <BaseLayout {...props}>
            <Input onChange={(e)=> setSearchFilter(e.target.value)}/>
           
            <Table dataSource={filteredTasks} columns={columns}/>
   
<AddButton name="quotes" user={user}>
<Input label="text" name="text" placeholder="text" style={{marginTop: 10, marginBottom: 10}}/>
<Input label="author" name="author" placeholder="author" style={{marginTop: 10, marginBottom: 10}} />
</AddButton>
        </BaseLayout>
    )

}

export default List;