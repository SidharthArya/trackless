import BaseLayout from '../../layouts/BaseLayout';
import {useState, useEffect, useContext} from 'preact/hooks';
import {Select, Typography} from 'antd';
import { getDocumentAsync, getDocumentsAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import { Area } from '@ant-design/charts';
import { sortEKeys } from '../../lib/utils';
// import { Renderer as SVGRenderer } from '@antv/g-svg';

const SERVICE = "exercise"


const Exercise = (props: any) => {
    const [typeList, setTypeList] = useState([]);
    const [selectedType, setSelectedType] = useState(props.type ? props.type : '');
    // const [exerciseType, setExerciseType] = useState({});
    const [exerciseList, setExerciseList] = useState({});
    const [exerciseData, setExerciseData] = useState([]);
    const [selectedPart, setSelectedPart] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const {user} = useContext(UserContext);
    useEffect(()=>{
        console.log('ed', exerciseData)
    }, [exerciseData])
    function setExerciseList_d(d) {
        setExerciseList(d)
    }
    function setTypeList_d(d) {
        setExerciseList(d)
    }
    function setExerciseData_d(d) {
        setExerciseData(d)
    }
    const handleTypeChange = (value) => {
        setSelectedType(value);
        setExerciseList([])
        setSelectedPart('')

        getDocumentAsync(user, 'settings', `exercises/${value}`, [setExerciseList_d]);

      };
    const handlePartChange = (value: any) => {
        setSelectedPart(value);
      };
    function preProcessExercise (docs: any) {
        let result: any[] = [];
        docs.forEach((d) => {
            d.Date = d.Date.toDate();
            // d.Date = d.Date.toISOString();
            if (d.Weights && isNaN(d.Weights)) d.Weights = 0 
            if (d.Volume && isNaN(d.Volume)) d.Volume = 0 
            result.push(d);
        });
        return result;
    }
      const handleExerciseChange = (value: any) => {
        setSelectedExercise(value);
        let ex = value;
        let data = {};
        getDocumentsAsync(user, 'data', `exercises/${selectedType}/${value}`, [preProcessExercise, setExerciseData_d], false)
      };
      function docIdFromDocs(docs: any) {
        let d: any[] = []
        docs.forEach((doc:any)=> d.push(doc.id))

        setTypeList(d)

        // return d;
    }
    const makePlotConfigs =(data: any, yField: any) => {
        const config = {

            animate: { enter: { type: 'waveIn' } },
            data: data,
            autoFit: true,
            xField: 'Date',
            yField: yField,
            shapeField: 'smooth',
            style: {
              fill: 'linear-gradient(-90deg, #00660000 0%, #00666699 100%)',
            },
            axis: {
              y: { labelFormatter: '~s' , title: yField,  grid: true, gridLineWidth: 2, line: true, gridStroke: '#cccccc', gridStrokeOpacity: .3, gridLineDash: [20, 10]},
              x: {title: 'Date',line: true,  style: {labelTransform: 'rotate(10)'},  grid: true, gridLineWidth: 2, gridStroke: '#cccccc', gridStrokeOpacity: .3, gridLineDash: [20,10]}
            },

          };
          return config;
    }
    useEffect(()=>{

        getDocumentsAsync(user, 'settings', 'exercises', [docIdFromDocs], true);
        console.log('TypeList', typeList)
    }, [Object.keys(exerciseList).length])
    return (
    <BaseLayout {...props}>
        <Typography>
    <h2 style={{textAlign: 'center'}}>Exercise Graphs</h2>
    <Select style={{minWidth: '9rem'}} onChange={handleTypeChange} value={selectedType}>
        {typeList && typeList.map((type)=>{
            return <Select.Option value={type}>{type}</Select.Option>

        })}
    </Select>
    {selectedType && (
    <Select style={{minWidth: '9rem'}} onChange={handlePartChange} value={selectedPart}>
        {Object.keys(exerciseList).map((type)=>{
            return <Select.Option value={type}>{type}</Select.Option>

        })}
    </Select>
    )
    }

{selectedPart && <Select style={{minWidth: '16rem'}} onChange={handleExerciseChange} value={selectedExercise}>
        {exerciseList[selectedPart].map((type)=>{
            return <Select.Option value={type}>{type}</Select.Option>

        })}
    </Select>}
    </Typography>
{(exerciseData.length > 0) && Object.keys(exerciseData[exerciseData.length-1]).sort(sortEKeys).reverse().map((k)=>{
    if(!['id', 'Date'].includes(k)) 
        return (
        <div>
        <h3 style={{textAlign: 'center'}}>{k}</h3>
    <Area {...makePlotConfigs(exerciseData, k)}/>
        </div>
        )    
})}
    {/* <Area {...config} /> */}
{console.log("Exercise Data1", exerciseData)}

    </BaseLayout>)
}

export default Exercise;