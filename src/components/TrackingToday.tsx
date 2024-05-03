import { Select, Button, Progress, Input,Card, Typography, Form} from 'antd';
import { sortEKeys } from '../lib/utils';
import { useEffect, useState, useContext } from 'preact/hooks';
import { setDocumentAsync } from '../lib/database';
import { UserContext } from './Login';


const ExerciseToday = (props) => {
    const {entry, etype, exercise, part} = props;
    const [loading, setLoading] = useState('initial');
    const {user} = useContext(UserContext);
    const handleVolume = (row)=>{
        let Volume = 0;
        console.log(row.Weights, row.Reps)
        if (row.Weights!==undefined && row.Reps) {
          console.log("Here")
          
          if (row.Weights < 0)
          Volume = (row.Weights+1) * (20-Math.sqrt(row.Reps)) * row.Sets
        else
          Volume = (row.Weights+1) * Math.sqrt(row.Reps) * row.Sets
        }
        return Volume;
      };
    const getVals = (key = undefined) => {
        const form = document.querySelector(`#${entry.part}-${entry.exercise}`);
        const collection = form.getElementsByTagName('input');
        let output = {};
        if (key) return collection[key].value;
        for (let i = 0; i < collection.length; i++) {
            output[collection[i].name] = collection[i].value;
        }
        return output;
    };
    const getButton = () => {
        const form = document.querySelector(`#${entry.part}-${entry.exercise}`);
        const collection = form.getElementsByTagName('button');
        return collection[0];
    };
    const setVals = (val, key = undefined) => {
        const form = document.querySelector(`#${entry.part}-${entry.exercise}`);
        const collection = form.getElementsByTagName('input');
        if (key) collection[key].value = val;
        else Object.keys(val).forEach((k)=> {
            collection[k].value = val[k];
        })
    };
    const handleFieldChange = (e, v)=> {

        const d = getVals();
        setVals(handleVolume(d), 'Volume');
    }
    const handleSaveRow = (row) => {
        console.log('Here')
        row = getVals();
        console.log(row);
        setLoading('loading')
        row.Date = new Date();
        const tempId = row.id;
        const tempExercise = row.exercise;
        const tempPart = row.part;
        delete row.exercise;
        delete row.part;
        for (let rkey of Object.keys(row).sort(sortEKeys)){
          if (!['id', 'part', 'exercise', 'Date', 'placeholder'].includes(rkey)){
              row[rkey] = parseFloat(row[rkey]);
        }
          if (rkey === 'placeholder'){
            let v = JSON.parse('{' + row[rkey].split(' ').map((entry)=>{let a = entry.split(':'); return '"' + a[0] + '":' + a[1]}).join(',') + '}')
            delete row['placeholder'];
            v.Volume = parseFloat(handleVolume(row))
            row = Object.assign(row, v)
          }
      }
      console.log('Rowss',row);
      console.log(`tracking/${etype}/${tempExercise}/${row.Date.getTime().toString()}`);
      let btn = getButton();
      setDocumentAsync(user, 'data', `tracking/${etype}/${tempExercise}/${row.Date.getTime().toString()}`, row, function(){ setLoading('completed'); setTimeout(()=> setLoading('initial'), 2000); btn.textContent = "Saved";btn.classList.remove('ant-btn-primary'); btn.classList.add('ant-btn-dashed');}, function() {setLoading('failed'); setTimeout(()=> setLoading('initial'), 2000)})
        row.Date = row.Date.toISOString();
        setVals(row.Date, 'Date');
        setTimeout(()=> setLoading('initial'), 2000 )
        row.exercise = tempExercise;
        row.part = tempPart;
        // form.setFieldsValue(row);
        // setTableData((prev)=> {
    //       prev[row.id] = row
    //       return prev
    //     })
    //     row.id = tempId;
      }
    useEffect(()=>{
        let elem = document.getElementById('Card-'+entry.part + '-' + entry.exercise)
        if (loading === 'loading'){
            elem?.classList.add('ant-card-shade');
            setTimeout(()=>setLoading('initial'), 5000)
        
        }
        else if (loading === 'completed') elem?.classList.add('ant-card-done');
        else if (loading === 'failed') elem?.classList.add('ant-card-error');        
        else{
            elem?.classList.remove('ant-card-shade');
            elem?.classList.remove('ant-card-done');
            elem?.classList.remove('ant-card-error');
        }
    console.log(loading, elem)
    }, [loading])
    setTimeout(()=> setVals('Weights:0 Reps:0 Sets:0', 'placeholder'), 2000)

    return <Form
    name={part + '-' + exercise} 
    onFinish={handleSaveRow} 
    style={{margin: '0 auto', position:'relative'}}>
    
    <Card 
            hoverable 
            extra={part} 
            title={exercise} 
            style={{marginBottom: 20, maxWidth: 300}}
            // className="ant-card-shade"
            id={'Card-'+part+'-'+exercise}
            // cover={()=> {if (exerciseImg[entry.exercise]) return <img alt="example" style={{width: '100%'}} src={exerciseImg[entry.exercise]}/>}}
            >
            <div>

                {Object.keys(entry).sort(sortEKeys).map((k)=>{
                    if (k !== 'id'){
                        if (["part", "exercise"].includes(k))
                            return (
                            <Input name={k} style={{flex: 1, }} type='string' value={entry[k]} disabled /> 
                            );
                        else if (k === 'placeholder')
                            return (
                                <div style={{ flex: 1}}>
                                <Input name={k} placeholder={k} />
                                </div>
                                );
                                   else if (k === 'Volume' || k == 'Date')
                            return (
                                <div style={{ flex: 1}}>
                            <Input name={k} placeholder={k} value={entry[k]} disabled/>
                                </div>
                                )
                        else
                            return (<div style={{ flex: 1}}>
                                <Input name={k} placeholder={k} type='number' step="0.25" defaultValue={entry[k]} onChange={handleFieldChange} />
                                </div>

)
                    }
                    
                })}
                {console.log(part, exercise, entry)}
                <br></br>
                <Button type="primary" htmlType='submit'>Save</Button>
            </div>
            </Card>
            </Form>
}
export default ExerciseToday;