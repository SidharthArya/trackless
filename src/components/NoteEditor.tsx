import { useContext, useState, useEffect } from 'preact/hooks';
// import React from 'preact';
import BaseLayout from '../../layouts/BaseLayout'
import {PlusOutlined }  from '@ant-design/icons';
import { getDocumentsAsync, getDocumentAsync, setDocumentAsync, updateDocumentAsync, deleteDocumentAsync } from '../lib/database';
import { UserContext } from './Login';
import dayjs from 'dayjs';
import { Button,  Typography } from 'antd';
import Checkbox from './Checkbox.js';
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Table from '@editorjs/table'; 
// import Link from '@editorjs/link'; 
import SimpleLink from '../lib/editorjs/SimpleLink2';
import MarkerTool from '../lib/editorjs/MarkerTool';
import ReviseTool from '../lib/editorjs/ReviseTool';
import Formula from '../lib/editorjs/formula';
import NodeLink from '../lib/editorjs/NodeLink.js';
import Embed from '@editorjs/embed'; 
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import RawTool from '@editorjs/raw';
import ImageTool from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';
import FootnotesTune from '@editorjs/footnotes';
import SimpleImage from "@editorjs/simple-image";
import Checklist from '@editorjs/checklist'
// MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});

const NoteEditor = (props) => {
    const {user} = useContext(UserContext);
    const [editor, setEditor] = useState<EditorJS>();
    const [editorData, setEditorData] = useState({});
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [backlinks, setBacklinks] = useState([]);
    const [blocksP, setBlocksP] = useState([]);
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState(props.notes ? props.notes : '');
    const [tags, setTags] = useState({});
    const [tagOpt, setTagOpt] = useState([]);
    const [rendered, setRendered] = useState(false);
    const [now, setNow] = useState<Date>(props.now ? new Date(parseInt(props.now)) : new Date());
    // Tags
    useEffect(()=> {
      if (!props.notes)
          getDocumentsAsync(user, 'data', 'notes', [setNotes], false, -1, [],null, [["state", "!=", "ARCHIVE"]]);
    }, [notes.length])

    useEffect(()=>{
      getDocumentsAsync(user, 'settings', 'tags', [(docs)=>{
          let dd = {};
          let opt = [];
          docs.map((d)=>{
              dd[d.id] = d
              opt.push({key: d.id, label: d.id})
          
          });
          setTags(dd);
      }], false)
  }, [tags.length])

    useEffect(()=>{
      console.log('Now', now)
      getDocumentAsync(user, 'data', 'notes/' + now.getTime().toString(),[(doc)=>{setData(doc)}]);
      getDocumentsAsync(user, "data", "notes/" + now.getTime().toString() + '/blocks', [(docs)=>{ 
        docs = docs.sort((d1,d2)=> d1.id - d2.id);
        docs = docs.map((doc)=> {delete doc.id; return doc})
        setBlocksP(docs)
      }], false)
      getDocumentsAsync(user, "data", "notes/" + now.getTime().toString() + '/backlinks', [(docs)=>{ 
        docs = docs.sort((d1,d2)=> d1.id - d2.id);
        // docs = docs.map((doc)=> {delete doc.id; return doc})
        setBacklinks(docs)
      }], false)
    }, [now])
    useEffect(async ()=>{
      data && data.tags && setTagOpt(data.tags);
      if (editor) {
        await editor.blocks.clear()
        await editor.blocks.render({...data, blocks: blocksP})
      }
    }, [data])

    // }, [blocksP])
    useEffect(()=>{
      console.log('Props', now, props.now)
      if (!props.now){
      const t = new Date();
      // console.log('T', t)
      setNow(t);
    }
    }, [])
    useEffect(()=> {
      console.log('Now2', now)
      if (props.now)
      setNow(new Date(parseInt(props.now)))
      setRendered(false)
      // setNow(prev => {
      //   if (editor) editor.blocks.clear()
        
      //   return new Date(parseInt(props.now)
      // )})
    }, [props])
    useEffect(() => {
        if (rendered) return;
        console.log('Notes', notes)
        if (typeof notes === 'string') return;
        let editor = new EditorJS({ 
            holder: 'editorjs', 
            // onChange: (api, event) => {

            //     // console.log('Now I know that Editor\'s content changed!', event)
            // },
            onReady: ()=>{
                console.log('Ready')
            },
            /** 
             * Available Tools list. 
             * Pass Tool's class or Settings object for each Tool you want to use 
             */ 
            tools: { 
              raw: RawTool,
              header: {
                class: Header, 
                inlineToolbar: true,
                config: {
                  placeholder: 'Header',
                  levels: [1, 2, 3, 4,5,6],
                  defaultLevel: 2
                }
              }, 
              checklist: {
                class: Checklist,
                inlineToolbar: true,
              },
              list: { 
                class: List, 
                inlineToolbar: true 

              },
              table: { 
                class: Table, 
                inlineToolbar: true 
              },
              ref: { 
                class: NodeLink, 
                inlineToolbar: true,
                config: {
                  nodes: notes,
                }
              },
              marker: {
                class: MarkerTool,
                inlineToolbar: true
              },
              revise: {
                class: ReviseTool,
                inlineToolbar: true
              },
              simplelink: {
                class: SimpleLink
              },
              embed: { 
                class: Embed, 
                inlineToolbar: true 
              },
              tools: {
                class: CodeTool,
                inlineToolbar: true 
                
              }, 
              attaches: {
                class: AttachesTool,
                config: {
                  endpoint: 'http://localhost:8008/uploadFile'
                },
              },
              image: {
                class: SimpleImage
              },
              formula: {
                class: Formula
              },
              footnotes: {
                class: FootnotesTune,
              },
              inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+M',
              },
            }, 
          });

        setEditor(prev => {
          setRendered(true);
          return editor;

        });
      }, [notes]);

      const handleTagChange = (tag, checked) =>{
        
        if(checked)
          setTagOpt(prev=> [...prev, tag])
        else setTagOpt(prev => prev.filter((p)=> p != tag));
      
      }
      const handleSaveData = ()=> {
        console.log(editor, tagOpt);
        editor.save().then((data)=> {
          let blocks = data.blocks;
          delete data.blocks;
          data.state = 'ACTIVE';
          data.tags = tagOpt;
          let title = blocks[0].type == 'header' ? blocks[0].data : toString(data.time);
          setDocumentAsync(user, "data", "notes/" + now.getTime().toString(), {title: title, ...data});
          let backlinks = {}; 

          blocks.forEach((block, index)=>{
            // What if the backlink is removed
            if (block.type === 'ref') {
              if (backlinks[block.data.id])
                backlinks[block.data.id].push(index);
              else
              backlinks[block.data.id] = [index];
              // return;
            }
            if (block.type === 'paragraph') {
              console.log('Block', block)
              if(block.data.text.includes('<u>')){
                block.revise = true;
                block.next = new Date();
                block.revised = 0;
              }
            }
            
            if (!blocksP[index] || JSON.stringify(blocksP[index]) != JSON.stringify(block)){
            setDocumentAsync(user, "data", "notes/" + now.getTime().toString() + "/blocks/" + index.toString(), block);

        }
            })

          if (blocks.length < blocksP.length)
            blocksP.map((block, index)=> {
              if (index >= blocks.length)
                deleteDocumentAsync(user, "data", "notes/" + now.getTime().toString() + "/blocks/" + index.toString()) 
            });
          Object.keys(backlinks).map((id)=>{
            setDocumentAsync(user, "data", "notes/" +  id + "/backlinks/" + now.getTime().toString() , {links: backlinks[id]});
            let d = {};
            d[now.getTime().toString() + '-' + id.toString()] = {source: now.getTime().toString(), target: id.toString(), value: backlinks[id].length};
          updateDocumentAsync(user, 'data', 'noteLinks/notelinks', d);
          })
          setBlocksP(blocks)
        });
      };
      const getBacklinkNote = (backlink) => {
        let a = notes.filter((n)=>backlink.id == n.id)[0];
        return <a target="_blank" href={'/notes/note?id=' + a.id}> {a.title.text}</a>
      }
    return (<>
    <div>

    <Button type="primary" style={{float: 'right', zIndex: 100}} onClick={handleSaveData}>Save</Button>
    {Object.keys(tags).map((tag)=> <Checkbox handleTagChange={handleTagChange} tag={tag} tagOpt={tagOpt} color={tags[tag].color ? tags[tag].color : '#000'}/>

    )}
    </div>
    <div id="editorjs"></div>
    {backlinks.length > 0 && (
      <Typography>
        <h3>Backlinks</h3>
        {backlinks.map((backlink) => <p>{getBacklinkNote(backlink)}</p>)}
      </Typography>
    )}
    </>
    )

}

export default NoteEditor;