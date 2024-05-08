import { Button, Checkbox, ColorPicker, Form, Input } from "antd";
import '../style/checkbox.css'
import { useEffect, useRef, useState } from "preact/hooks";
import { updateDocumentAsync } from "../lib/database";
const Checkb = (props) => {
    const [checked, setChecked] = useState(false)
    const ref = useRef()
    const [contextmenu, setContextMenu] = useState(false)
    const handleChange = (e)=>{
        if (e.target.checked) setChecked(true)
        else setChecked(false)
        props.handleTagChange(props.tag, e.target.checked)
    }

    useEffect(()=>{
        if(props.tagOpt && props.tagOpt.includes(props.tag))
            setChecked(true)
        else setChecked(false)
    }, [props.tagOpt])
    useEffect(()=>{
        ref.current.input.parentElement.parentElement.addEventListener('contextmenu', (e)=>{
            e.preventDefault();
            setContextMenu(true)

        })
    }, [ref])
    const handleClick = (e) => {
        e.preventDefault()
        console.log(e)
    }
    return (<>
    {checked && <Checkbox ref={ref} id='temp' style={{backgroundColor: props.color, color: '#fff', borderRadius: 10, padding: 6, margin: 6}} onChange={handleChange} > {props.tag}</Checkbox> || <Checkbox ref={ref} style={{margin: 2, border: '2px solid ' + props.color, borderRadius: 10}} onChange={handleChange} > {props.tag}</Checkbox>}
    {contextmenu && (<div style={{position: 'absolute', zIndex: 1000, minWidth: 100, background: '#fff', padding: 10,borderRadius: 10, border: '1px solid '+props.color}}>
        <Form onFinish={(e)=> {updateDocumentAsync(props.user, 'settings', 'tags/' + e.id, {color: e.color.toHexString()}); setContextMenu(false)}}>
            <Form.Item name="id" initialValue={props.tag}>
        <Input placeholder="name" />
        </Form.Item>
        <Form.Item name="color"  initialValue={props.color} >
        <ColorPicker/>
        </Form.Item>
        <Form.Item noStyle>
        <Button htmlType="submit" type="primary">Submit</Button>
        </Form.Item>
        <Form.Item noStyle>
        <Button  onClick={(e)=> setContextMenu(false)}>Cancel</Button>
        </Form.Item>
        </Form>
        
        </div>)}
    </>
    )
    }
export default Checkb