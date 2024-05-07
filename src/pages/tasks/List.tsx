import { useContext, useState, useEffect } from 'preact/hooks';
import React from 'preact';
import BaseLayout from '../../layouts/BaseLayout'
import {FloatButton, Table,Radio, Select,Button, Dropdown, Input, theme, Form, TableColumnType, DatePicker, Tag} from 'antd';
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import dayjs from 'dayjs';
import { Checkbox } from 'antd';
import AddButton from '../../components/AddButton';
import Fuse from 'fuse.js';
import TagFilter from '../../components/TagFilter';
import {useSignal, effect} from '@preact/signals';

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
    const [filteredTasks, setFilteredTasks] = useState([]);
    const tags = useSignal({});
    const [searchFilter, setSearchFilter] = useState("");
    const [tagOpt, setTagOpt] = useState([]);
    const [hideTags, setHideTags] = useState(props.hidetags ? props.hidetags : false);
    const [states, setStates] = useState({});
    const [statesM, setStatesM] = useState({});
    const [floatB, setFloatB] = useState(false);
    const [taskFilter, setTaskFilter ] = useState([]);
    const [stateFilter, setStateFilter] = useState(props.state ? props.state : 'TODO');
    const tagsFilter = useSignal(props.tag ? props.tag : '');
    const [newform] = Form.useForm();
    const [fuse, setFuse] = useState(new Fuse([], {keys: ['name', 'description', 'tags']}));

    
    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
      } = theme.useToken();

    const handleKeyDown = (e, record) => {
            const field = e.target.name
            const value =  e.target.value;
            const data = {};
            data[field] = value;
            console.log(record)
            updateDocumentAsync(user, 'data', 'tasks/' + record.id, data)
      };
    const handleDateUpdate = (e, record) => {
        const field = 'scheduled';
        const value =  e;
        const data = {};
        data[field] = value.toDate();
        console.log('Date Update', data)
        updateDocumentAsync(user, 'data', 'tasks/' + record.id, data)
    }
    const handleGetState = (v,record, e) => {
        if (v == 'DELETE')
            deleteDocumentAsync(user, 'data', 'tasks/' + record.id)
        else
            updateDocumentAsync(user, 'data', 'tasks/' + record.id, {state: v})
    };
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
            return (<Input style={fieldStyle} label='Name' name='name' type='text' onKeyDown={(e)=> (e.key === "Enter") && handleKeyDown(e, record)} defaultValue={text} />)

          }
        },
        {
          title: 'Description',
          dataIndex: 'description',
          sorter: (a, b) => a.name.length - b.name.length,
          key: 'desciption',
          render: (text, record) => {
                return (<Input style={fieldStyle}  defaultValue={text} label='Description' name='description' type='text' onKeyDown={(e)=> (e.key === "Enter") && handleKeyDown(e, record)}/>)
          }
        },
        {
            title: 'Due',
            dataIndex: 'due',
            sorter: (a, b) => a.name.length - b.name.length,
            key: 'due',
            render: (text, record) => {
                if (text)
                return <DatePicker style={fieldStyle} showTime defaultValue={dayjs(new Date(text.seconds*1000))}/>
                return <DatePicker showTime/>
        }
          },
        {
            title: "Scheduled",
            dataIndex: 'scheduled',
            sorter: (a, b) => a.name.length - b.name.length,
            key: 'scheduled',
            render: (text, record) => {
                if (text)
                return <DatePicker style={fieldStyle} showTime defaultValue={dayjs(new Date(text.seconds*1000))} onOk={(e)=> handleDateUpdate(e, record)}/>
                return <DatePicker showTime onOk={(e)=> handleDateUpdate(e, record)}/>
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
    
    setDocumentAsync(user, 'data', 'tasks/' + date.getTime().toString(), data)
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
        let docs_o = docs;
        let data = [];

        if (stateFilter.length)
            docs = docs.filter((doc) => stateFilter.length && doc.state === stateFilter )
        if (tagsFilter.value.length)
            docs = docs.filter((doc) => tagsFilter.value.length && doc.tags && doc.tags.includes(tagsFilter.value) )
        fuse.setCollection(docs);
        if (searchFilter && searchFilter.length > 1)
            docs = fuse?.search(searchFilter).map((d)=> d.item);
        console.log('filteredData', docs)
        setFilteredTasks(docs)
        return docs_o;
    }
    useEffect(()=>{
        getDocumentsAsync(user, 'data', 'tasks', [setFilteredTasks_n,setTasks], false, -1, [],null, [["state", "!=", "ARCHIVE"]])
    }, [tasks.length])
    useEffect(()=>{
        getDocumentsAsync(user, 'settings', 'tasks/meta/states', [(docs)=>{
            let dd = {};
            let opt = [];
            docs.map((d)=>{
                dd[d.id] = d;
                opt.push({key: d.id, label: d.id})
                
            });
            setStates(dd);
            setStatesM(opt);
        }], false, -1, [], ()=>{
            console.log('Failed'); 
            setDocumentAsync(user, 'settings', 'tasks/meta/states/TODO', {color: '#900'});
            setDocumentAsync(user, 'settings', 'tasks/meta/states/DONE', {color: '#090'});
        })
    }, [states.length])

    useEffect(()=>{
        setFilteredTasks_n([]);
        setTimeout(()=> setFilteredTasks_n(tasks), 1);
        const url = new URL(window.location.href);
        url.searchParams.set('state', stateFilter);
        // url.searchParams.set('tag', tagsFilter);
        window.history.replaceState({}, '', url);
        
    }, [stateFilter, tagsFilter.value, searchFilter])
    
    const makeFilters = () => {
        return (<>
      <Input onChange={(e)=> setSearchFilter(e.target.value)} placeholder="Search"/>

         {!props.hidetags && <Checkbox onChange={(e)=> setHideTags(e.target.checked)}>Hide Tags</Checkbox>}
            <br></br>
            <span> States : </span>
        <Radio.Group value={stateFilter} buttonStyle="solid" onChange={(s)=> setStateFilter(s.target.value)}>
        <Radio.Button value='' buttonBg="#000">All</Radio.Button>
        {Object.keys(states) && Object.keys(states).map((s)=> <Radio.Button value={s}>{s}</Radio.Button>)}
      </Radio.Group>
        <Button icon={<PlusOutlined/>} onClick={(e)=> {
            let state = prompt('State Name: ', 'TODO');
            let color = prompt('Color: ', '#000000');
            if (state && color) setDocumentAsync(user, 'settings', 'tasks/meta/states/' + state, {color: color});
        }}/>
         <br></br>
      {props.hidetags || !hideTags && (
      <div>
            <span> Tags : </span>
            <TagFilter tags={tags} filter={tagsFilter} user={user}/>

      <br></br>
      </div>
      )}
      <br></br>
            </>)
    }
    return (

        <BaseLayout {...props} filters={makeFilters()}>
           
     
  
        <Table dataSource={filteredTasks} columns={columns}/>
        <AddButton name="tasks" user={user}>

        <Select
      style={{marginTop: 10, marginBottom: 10, width: '100%'}}
      placeholder="State"
      defaultValue={"TODO"}
      selectorBg="#000"
      labelRender={(text) => {
        if(states[text] && states[text].color) 
            (<Tag color={states[text].color}>{text}</Tag>)
        else
        (<Tag color='#000'>{text}</Tag>)
      }}
      onChange={handleNewGetState}
    //   options={tagOpt}
    >
        {Object.keys(states).map((t)=>
            <Select.Option value={t}>{t}</Select.Option>

        )}

</Select>
<Input label="state" name='state' style={{display: 'none'}} placeholder="state"/>
    
      <Input label="name" name="name" placeholder="name" style={{marginTop: 10, marginBottom: 10}}/>
      <Input label="description" name="description" placeholder="description" style={{marginTop: 10, marginBottom: 10}} />
      <DatePicker showTime name="due" placeholder="due" style={{marginTop: 10, marginBottom: 10}} />
      <DatePicker showTime name="scheduled" placeholder="scheduled" style={{marginTop: 10, marginBottom: 10}} />
      <Input label="tags" name='tags' style={{display: 'none'}} placeholder="name"/>
      <Select
      mode="multiple"
      optionLabelProp="label"
      style={{marginTop: 10, marginBottom: 10, width: '100%'}}
      placeholder="Tags"
      onChange={handleNewGetTags}
    //   options={tagOpt}

    >
        {Object.keys(tags.value).map((t)=>
            <Select.Option value={t}>{t}</Select.Option>

        )}
</Select>
    
        </AddButton>
        </BaseLayout>
    )

}

export default List;