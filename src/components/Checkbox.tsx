import { Checkbox } from "antd";
import '../style/checkbox.css'
import { useEffect, useState } from "preact/hooks";
const Checkb = (props) => {
    const [checked, setChecked] = useState(false)

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
    if (checked)
    return <Checkbox style={{backgroundColor: props.color, color: '#fff', borderRadius: 10, padding: 2, margin: 2}} onChange={handleChange} > {props.tag}</Checkbox>
    else
    return <Checkbox onChange={handleChange} > {props.tag}</Checkbox>
}
export default Checkb