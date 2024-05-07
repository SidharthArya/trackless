import { FloatButton, Button, Layout, Radio, Input } from 'antd';
import { useEffect } from 'preact/hooks';
import { getDocumentsAsync, setDocumentAsync } from '../lib/database';
import { effect } from '@preact/signals';
import {PlusOutlined }  from '@ant-design/icons';


const TagFilter = (props) => {
    const tags = props.tags;
    const tagsFilter = props.filter;
    const user = props.user;
    effect(()=>{
        const url = new URL(window.location.href);
        url.searchParams.set('tag', tagsFilter.value);
        window.history.replaceState({}, '', url);
      })
    useEffect(()=>{
        getDocumentsAsync(props.user, 'settings', 'tags', [(docs)=>{
            let dd = {};
            let opt = [];
            docs.map((d)=>{
                dd[d.id] = d
                opt.push({key: d.id, label: d.id})
            
            });
            tags.value = dd;
            // setTagOpt(opt);
        }], false)
    }, [tags])
  
    return ( <Radio.Group value={tagsFilter.value} buttonStyle="solid" onChange={(s)=> {tagsFilter.value = s.target.value}}>
    <Radio.Button value='' buttonBg="#000">All</Radio.Button>
    {Object.keys(tags.value) && Object.keys(tags.value).map((s)=> <Radio.Button value={s}>{s}</Radio.Button>)}
    <Button icon={<PlusOutlined/>} onClick={(e)=> {
            let tag = prompt('Tag Name: ', 'TODO');
            let color = prompt('Color: ', '#000000');
            if (tag && color)
                setDocumentAsync(user, 'settings', 'tags/' + tag, {color: color});
        }}/>
  </Radio.Group>)
}

export default TagFilter;