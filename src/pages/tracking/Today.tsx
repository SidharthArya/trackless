import { useContext, useEffect, useState } from 'preact/hooks';
import { UserContext } from '../../components/Login';
import BaseLayout from '../../layouts/BaseLayout';
import { getDocumentAsync, getDocumentsAsync } from '../../lib/database';
import { getDocsIdOnly, progressiveOverload } from '../../lib/utils';
import { Select, Button, Input,Card, Typography, Form} from 'antd';
import { sortEKeys } from '../../lib/utils';
import '../../style/datainput.css';
import {exerciseImg} from '../../config';
import TrackingToday from '../../components/TrackingToday';



const Today = (props) => {
    const {user} = useContext(UserContext);
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = new Date();
    const todayDay = weekday[today.getDay()];
    const [exerciseList, setExerciseList] = useState({});
    const [dayList, setDayList] = useState({});
    const [Etype, setEtype] = useState('');
    const [EtypeList, setEtypeList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [selectedPart, setSelectedPart] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    useEffect(()=>{
        getDocumentsAsync(user, 'settings', 'tracking', [getDocsIdOnly, setEtypeList], true);
    }, [Object.keys(dayList).length])

    const handleEtypeChange = (value) => {
        setEtype(value)

        function main (exercises) {
            setExerciseList(exercises)
            setTableData([])
            // todayDay
            // console.log('Exercises', exercises)
        for (const part of Object.keys(exercises)) {
          for (const exercise of exercises[part]){

        function nosnap(){
            let d = {};
            d.part = part;
            d.exercise = exercise;
            let dattt = new Date();
            dattt.setSeconds(dattt.getSeconds() - 60*60*24*90);
            d.Date = dattt.toISOString();
            d = progressiveOverload(d);
            d.placeholder = ""
            setTableData(data => [...data.filter(a=> a.part + a.exercise !== d.part + d.exercise), d]);
        }
        function makeTableSnap(docs) {
            docs.forEach((d)=>{
                d.part = part;
                d.exercise = exercise;
                console.log('Exercise', exercise, docs)
                let t = new Date(d.Date.seconds*1000);
                d.Date = t.toISOString();
                d = progressiveOverload(d);
                // console.log(d)
                setTableData(data => [...data.filter(a=> a.part + a.exercise !== d.part + d.exercise), d]);
            })

        }
            getDocumentsAsync(user, 'data', `tracking/${value}/${exercise}`, [makeTableSnap],false, 1, ['Date', 'desc'], nosnap)
            console.log('TableData', tableData)
        }
        }

        }
        getDocumentAsync(user, 'settings', 'tracking/' + value, [main])
        
        
    }

     
    return (
        <BaseLayout {...props}>
        <Typography>
        <Select style={{display: 'block'}} placeholder="Exercise Type" value={Etype} onChange={handleEtypeChange}>
        {EtypeList.length > 0 &&  EtypeList.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select>
        <br></br>

        <div style={{width: '100%'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
        {tableData.sort((e)=> e.Date).reverse().map((entry)=>{
            console.log('Etype', Etype)
            return( <TrackingToday entry={entry} etype={Etype} part={entry.part} exercise={entry.exercise}/>
            )
        })}
            
        </div>
        </div>
        </Typography>
        </BaseLayout>
    )
}

export default Today;