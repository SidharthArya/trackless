import { useContext, useState, useEffect } from 'preact/hooks';
import React from 'preact';
import {FloatButton, Table,Radio, Select,Button, Dropdown, Input, theme, Form, TableColumnType, DatePicker, Tag} from 'antd';
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../lib/database';
import { UserContext } from '../../components/Login';
import dayjs from 'dayjs';
import Fuse from 'fuse.js';
import { Checkbox } from 'antd';


const List = (props) => {
    const [newform] = Form.useForm();
    const [name, setName] = useState(props.name);
    const [user] = useState(props.user);
    if (!props.user || !props.name) return;
    
    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
      } = theme.useToken();

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
    
    setDocumentAsync(user, 'data', name + '/' + date.getTime().toString(), data)
        console.log(data);
    }
    const newTaskForm = (e) => {
        if (!document.getElementById('newform')) {console.log(document.getElementById('newform')); return;}
        if (document.getElementById('newform').style.zIndex == '-1'){
            document.getElementById('floatbutton').style.transform = "rotateZ(225deg)";
            document.getElementById('floatbutton').children[0].style.backgroundColor = "#eeeeee";
            document.getElementById('floatbutton').children[0].children[0].children[0].style.color = "#555555";
            document.getElementById('addbutton').children[0].style.backgroundColor = "#167fff";
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


    return (<>
    <FloatButton
      trigger="hover"
      type="primary"
      id="floatbutton"
      style={{transition: '.5s'}}
      onClick={newTaskForm}
      icon={<PlusOutlined />}
    />
    <Form
    form={newform}
    id="newform"
    name="newform"
    onFinish={handleNewTask}

    style={{transition: '.5s', transform: 'translateY(100%)', position:'fixed', background: '#eeeeee', color: colorPrimary, display: 'block', zIndex: -1, borderRadius: borderRadiusLG, right: '5rem', width: '100%', maxWidth: 360, bottom: '1rem', border: '1px solid', borderColor: colorPrimary}}>

        <div style={{padding: 20}} >
        <div>Create new {name}</div>
        {props.children}
      </div>
      <FloatButton icon={<PlusOutlined />} id="addbutton" style={{transform: 'translateY(-130%) translateX(200%)'}} onClick={handleNewTask}/>
    </Form>
    </>
    )

}

export default List;