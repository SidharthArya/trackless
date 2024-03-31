import { useState, useEffect, useContext } from 'preact/hooks';
import { sortEKeys, makePlotConfigs} from '../../lib/utils';
import { getDocumentAsync, getDocumentsAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import BaseLayout from '../../layouts/BaseLayout';
import {Typography, Select} from 'antd';
import { Area } from '@ant-design/charts';


const Progress = (props: any) => {
    const {user} = useContext<any>(UserContext);
  const [trackables, setTrackables] = useState([]);
  const [trackable, setTrackable] = useState('');
  const [trackingType, setTrackingType] = useState('');
  const [track, setTrack] = useState('');

  const [trackingList, setTrackingList] = useState<any>({});
  const [trackingData, setTrackingData] = useState([]);

  // const [loggedIn, setLoggedIn] = useState(undefined);

  const getTrackables = () => {
    function setTrackables_d(docs: any) {
        let data: any = [];
        docs.forEach((doc: any)=>{
            data.push(doc.id);
        })
        setTrackables(data);
    }
    getDocumentsAsync(user, "settings", "tracking", [setTrackables_d], true)
  }
  useEffect(()=>{
    getTrackables();
    console.log(trackables);
  }, [trackables.length])
    // getDoc(doc(db,"settings", u.uid, "tracking", "mental")).then((a)=>{
    //   setTrackingList(a.data());
    // })
    // setLoggedIn(true);
//   }




  const handleTrackableChange = (value: any) => {
    setTrackable(value);
    getDocumentAsync(user, "settings", `tracking/${value}`, [setTrackingList])
    console.log('TrackingList', trackingList)
    
  }
  const handleTrackingTypeChange = (value: any) => {
    setTrackingType(value);
  }
  const handleTrackChange = (value: any) => {
    function preProcessTrack (docs:any) {
        let result: any[] = [];
        docs.forEach((d: any) => {
            d.Date = d.Date.toDate();
            result.push(d);
        });
        return result;
    }

    setTrack(value);
    getDocumentsAsync(user, "data", `tracking/${trackable}/${value}`, [preProcessTrack, setTrackingData], false)

  }

  return (
    <BaseLayout {...props}>
    <Typography>
    <h2 style={{textAlign: 'center'}}>Tracking Graphs</h2>
    <Select style={{minWidth: '9rem'}} onChange={handleTrackableChange} value={trackable}>
        {trackables.length && trackables.map((type: any)=>{
            return <Select.Option value={type}>{type}</Select.Option>

        })}
    </Select>
    {Object.keys(trackingList).length &&(<Select style={{minWidth: '9rem'}} onChange={handleTrackingTypeChange} value={trackingType}>
        {Object.keys(trackingList).map((t: any)=>{
                return <Select.Option value={t}>{t}</Select.Option>
        })}
    </Select>)}
    {trackingType && (<Select style={{minWidth: '9rem'}} onChange={handleTrackChange} value={track}>
        {trackingList[trackingType].map((t: any)=>{
                return <Select.Option value={t}>{t}</Select.Option>
        })}
    </Select>)}

    {trackingData.length  && Object.keys(trackingData[trackingData.length-1]).sort(sortEKeys).reverse().map((k)=>{
    if(!['id', 'Date'].includes(k)) 
        return (
        <div>
        <h3 style={{textAlign: 'center'}}>{k}</h3>
    <Area {...makePlotConfigs(trackingData, k)}/>
        </div>
        )    
})}
    </Typography>

    </BaseLayout>
    )}


export default Progress;