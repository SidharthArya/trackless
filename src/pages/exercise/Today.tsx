import { useContext, useEffect, useState } from 'preact/hooks';
import { UserContext } from '../../components/Login';
import BaseLayout from '../../layouts/BaseLayout';
import { getDocumentAsync, getDocumentsAsync } from '../../lib/database';
import { getDocsIdOnly, progressiveOverload } from '../../lib/utils';
import { Select, Button, Input, Card, Typography, Form } from 'antd';
import { sortEKeys } from '../../lib/utils';
import '../../style/datainput.css';
import { exerciseImg } from '../../config';
import ExerciseToday from '../../components/ExerciseToday';



const Today = (props) => {
    const { user } = useContext(UserContext);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayDay = weekday[today.getDay()];
    const [exerciseList, setExerciseList] = useState({});
    const [fetched, setFetched] = useState(false);
    const [dayList, setDayList] = useState({});
    const [Etype, setEtype] = useState(props.type ? props.type : '');
    const [EtypeList, setEtypeList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableDataS, setTableDataS] = useState([]);
    const [tableLen, setTableLen] = useState(0);
    const [exerciseData, setExerciseData] = useState([]);
    const [selectedPart, setSelectedPart] = useState(props.part ? props.part : '');
    const [selectedExercise, setSelectedExercise] = useState(props.exercise ? props.exercise : '');
    useEffect(() => {
        getDocumentAsync(user, 'settings', 'exercises/days', [setDayList]);
        getDocumentsAsync(user, 'settings', 'exercises', [getDocsIdOnly, setEtypeList], true);
    }, [Object.keys(dayList).length])

    const setFetched_async = (data) => {
        fetched || setFetched(true);
        return data;
    }
    useEffect(() => {
        // setFetched(false);
        if (Object.keys(dayList).length < 1) return;
        const url = new URL(window.location.href);
        url.searchParams.set('type', Etype);
        window.history.replaceState({}, '', url);

        function main(exercises) {
            setExerciseList(exercises)
            setTableData([])
            // todayDay
            if (!Object.keys(dayList).length) {
                return;
            }
            for (const part of dayList[Etype][todayDay]) {
                for (const exercise of exercises[part]) {

                    function nosnap() {
                        let d = {};
                        d.part = part;
                        d.exercise = exercise;
                        let dattt = new Date();
                        dattt.setSeconds(dattt.getSeconds() - 60 * 60 * 24 * 90);
                        d.Date = dattt.toISOString();
                        d = progressiveOverload(d);
                        d.placeholder = ""
                        setTableData(data => {
                            let found = false;
                            let out = data.map(a => { if (a.part + a.exercise === d.part + d.exercise) {a=d; if (!found) found=true} return a})
                            if (!found)
                                out = [...out, d];
                            return out;
                        });
                    }
                    function makeTableSnap(docs) {
                        docs.forEach((d) => {
                            d.part = part;
                            d.exercise = exercise;
                            let t = new Date(d.Date.seconds * 1000);
                            d.Date = t.toISOString();
                            d = progressiveOverload(d);
                            setTableData(data => {
                                let found = false;
                                let out = data.map(a => { if (a.part + a.exercise === d.part + d.exercise) {a=d; if (!found) found=true} return a})
                                if (!found)
                                    out = [...out, d];
                                return out;
                            });
                        

                        })

                    }
                    getDocumentsAsync(user, 'data', `exercises/${Etype}/${exercise}`, [makeTableSnap], false, 1, ['Date', 'desc'], nosnap);
                }
            }

        }
        if (!Object.keys(dayList).length) {
            setTimeout(() => {console.log('Here'); setEtype(Etype)}, 2000);
            return;
        }
        getDocumentAsync(user, 'settings', 'exercises/' + Etype, [main, setFetched_async])
        // setFetched(true);


    }, [Etype, dayList])

 
    const handleEtypeChange = (value) => {
        setEtype(value)

    }
    useEffect(()=>{
        console.log('Length', tableLen)
        setTableDataS(tableData.sort((e) => e.Date).reverse())
        // console.log(tableData.length)
        // if (fetched){
        //     let tt = (tableData.sort((e) => e.Date).reverse());
        // setTableDataS(tt);
        // tt.map((t)=>{
        //     Object.keys(t).map((k)=>{
        //         if(typeof(t[k]) === 'number') 
        //             if(isNaN(t[k]))
        //                 console.log('T', t);
        //     })
        // })
        // }
    }, [tableData.length])


    return (
        <BaseLayout {...props}>
            <Typography>
                <Select style={{ display: 'block' }} placeholder="Exercise Type" value={Etype} onChange={handleEtypeChange}>
                    {EtypeList.length > 0 && Object.keys(dayList).length > 0 && EtypeList.map((type) => (
                        <Select.Option value={type}>{type}</Select.Option>
                    ))}
                </Select>
                <br></br>

                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {tableDataS.map((entry) => {
                            // return (<div></div>
                            return (<ExerciseToday entry={entry} etype={Etype} part={entry.part} exercise={entry.exercise} />
                            )
                        })}

                    </div>
                </div>
            </Typography>
        </BaseLayout>
    )
}

export default Today;