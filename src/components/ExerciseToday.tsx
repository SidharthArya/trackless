import { Select, Button, Progress, Input,Card, Typography, Form} from 'antd';
import { progressiveOverload, sortEKeys } from '../lib/utils';
import { useEffect, useState, useContext } from 'preact/hooks';
import { setDocumentAsync } from '../lib/database';
import { UserContext } from './Login';

const ExerciseToday = (props) => {
    const {entry, etype, exercise, part} = props;
    const [loading, setLoading] = useState('initial');
    const {user} = useContext(UserContext);
    const volumeHandlers = {
        'Weights': {deps: [], fn: (x) => x+1},
        'Reps': {deps: ['Weights'], fn: (x, y) => y < 0 ? 20 - Math.sqrt(x) : Math.sqrt(x)},
        'Time': {deps: [], fn: (x) => x},
        'Sets': {deps: [], fn: (x) => x}
    }
    const handleVolume = (row)=>{
        let Volume = 1;
        console.log('Here')

        Object.keys(row).map((k)=> {
            console.log('Here')
            if (!volumeHandlers[k]) return;
            let args = [parseFloat(row[k])];
            volumeHandlers[k].deps.map((k1)=> {args.push(parseFloat(row[k1]))});
            console.log('Args', args);
            let vol = volumeHandlers[k].fn.apply(null, args);
            Volume = Volume*vol;
        })
        // if (row.Weights!==undefined && row.Reps) {
          
        //   if (row.Weights < 0)
        //   Volume = (row.Weights+1) * (20-Math.sqrt(row.Reps)) * row.Sets
        // else
        //   Volume = (row.Weights+1) * Math.sqrt(row.Reps) * row.Sets
        // }
        
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
        if (!val) return;
        const form = document.querySelector(`#${entry.part}-${entry.exercise}`);
        const collection = form.getElementsByTagName('input');
        if (!collection[key]) return;
        if (key) collection[key].value = val;
        else Object.keys(val).forEach((k)=> {
            collection[k].value = val[k];
        })
    };
    const handleFieldChange = (e, v)=> {
        const d = getVals();
        console.log("Here", e);

        setVals(handleVolume(d), 'Volume');
    }
    const handleSaveRow = (row) => {

        row = getVals();
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
      let btn = getButton();
      setDocumentAsync(user, 'data', `exercises/${etype}/${tempExercise}/${row.Date.getTime().toString()}`, row, function(){ setLoading('completed'); setTimeout(()=> setLoading('initial'), 2000); btn.textContent = "Saved";btn.classList.remove('ant-btn-primary'); btn.classList.add('ant-btn-dashed');}, function() {setLoading('failed'); setTimeout(()=> setLoading('initial'), 2000)})
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
    }, [loading])
    setTimeout(()=> {let entry2 = progressiveOverload(entry); Object.keys(entry2).map((e)=> e === 'placeholder' ? setVals('Weights:0 Reps:0 Sets:0', 'placeholder'): setVals(entry[e], e))}, 2000)

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
                                {/* {console.log(entry[k], entry)} */}
                                <Input name={k} placeholder={k} type='number' step="0.01"  onChange={handleFieldChange} />
                                </div>

)
                    }
                    
                })}
                <br></br>
                <Button type="primary" htmlType='submit'>Save</Button>
            </div>
            </Card>
            </Form>
}
export default ExerciseToday;