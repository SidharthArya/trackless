import { useContext, useState, useEffect } from "preact/hooks";
import { UserContext } from "../../components/Login";
import BaseLayout from '../../layouts/BaseLayout';
import { Calendar, CalendarProps, BadgeProps, Badge, Tag, Radio, DatePicker, Button } from 'antd';
import dayjs, { Dayjs } from "dayjs";
import { getDocumentsAsync, setDocumentAsync, updateDocumentAsync } from "../../lib/database";
import { Checkbox } from 'antd';
import Calendar2 from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import {useSignal} from '@preact/signals';
import TagFilter from "../../components/TagFilter";
import '../../style/calendar.css';

const TaskCalendar = (props) => {
    const {user} = useContext(UserContext);
    const [calendar, setCalendar] = useState();
    const [tasks, setTasks] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const tags = useSignal({});
    const tagsFilter = useSignal(props.tag ? props.tag : '');
    const [hideTags, setHideTags] = useState(props.hidetags ? props.hidetags : false);
    const [rendered, setRendered] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filteredCalEvents, setFilteredCalEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [states, setStates] = useState({});
    const [calendarView, setCalendarView] = useState('day')

    const [stateFilter, setStateFilter] = useState(props.state ? props.state : 'TODO');



    const getListData = (value: Dayjs) => {
        let listData;
        // { type: 'warning', content: 'This is warning event' },
        // { type: 'success', content: 'This is very long usual event......' },
        // { type: 'error', content: 'This is error event 1.' },
        let tasks = filteredTasks;
        listData = tasks.filter((t)=> {
            if (t.due && t.due.seconds)
            return value.isSame(dayjs(t.due.seconds * 1000), 'date')
            if (t.scheduled && t.scheduled.seconds)
            return value.isSame(dayjs(t.scheduled.seconds * 1000), 'date')
            return false;
         }).map((t)=>{
            
            // console.log(value.date(), dayjs(t.due.seconds*1000))
            if (t.state == 'TODO') {
                return {type: 'warning', content: <span><Tag color={states[t.state] ? states[t.state].color : ''}>{t.state}</Tag>{t.name}</span> }
            }
            else if (t.state == 'DONE') {
                return {type: 'warning', content: <span><Tag color={states[t.state] ? states[t.state].color : ''}>{t.state}</Tag>{t.name}</span> }
            }
            else 
            return {type: 'error', content: t.name }
        });

        if (listData.length) console.log('listData', listData);
        return listData;
      };

    const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
      };
    
      const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item) => (
              <li key={item.content}>
                <Badge status={item.type as BadgeProps['status']} text={item.content} />
              </li>
            ))}
          </ul>
        );
            };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
      };
      useEffect(()=>{
        getDocumentsAsync(user, 'data', 'tasks', [setFilteredTasks_n, setTasks], false, -1, [],null, [["state", "!=", "ARCHIVE"]])
    }, [tasks.length]);
    useEffect(()=>{
      getDocumentsAsync(user, 'data', 'calendar', [setFilteredEvents_n, setCalendarEvents], false, -1, [],null, [["state", "!=", "ARCHIVE"]])
  }, [calendarEvents.length]);
    useEffect(()=>{
        getDocumentsAsync(user, 'settings', 'tasks/meta/states', [(docs)=>{
            let dd = {};
            let opt = [];
            docs.map((d)=>{
                dd[d.id] = d;
                opt.push({key: d.id, label: d.id})
                
            });
            setStates(dd);
        }], false)
    }, [states.length])

    useEffect(()=>{
        setFilteredTasks_n(tasks);
        setFilteredEvents_n(calendarEvents);
        setTimeout(()=> setFilteredTasks_n(tasks), 1);
        const url = new URL(window.location.href);
        url.searchParams.set('state', stateFilter);
        // url.searchParams.set('tag', tagsFilter.value);
        window.history.replaceState({}, '', url);
    }, [stateFilter, tagsFilter.value])

    useEffect(()=>{
      if (!calendar) return;
      if (!tags) return;
      let calendars = Object.keys(tags.value).map(t => {
        // console.log('T', t)
        return {
          id: t,
          name: t,
          backgroundColor: tags.value[t].color
        };
      })
      calendar.setCalendars(calendars);
    }, [tags.value])
    useEffect(()=>{
      if (!tags.value) return;
      if (calendar) return;

      const calendar2 = new Calendar2('#calendar', {
        defaultView: 'day',
        useFormPopup: true,
        useDetailPopup: true, 
        template: {
          time(event) {
            const { start, end, title } = event;
      
            return `<span style="color: white;">${title}</span>`;
          },
          allday(event) {
            return `<span style="color: gray;">${event.title}</span>`;
          },
        },
      });
      calendar2.on('beforeCreateEvent', (event)=> {
        let out = {};
        
        if (event.calendarId) out.tag = event.calendarId;
        if (event.start) out.start = dayjs(event.start).toDate();
        if (event.end) out.end = dayjs(event.start).toDate();
        out.state = 'TODO';
        if (event.description) out.description = event.description;
        if (event.location) out.location = event.location;
        if (event.title) out.title = event.title;
        let d = new Date();
        console.log('NewData', event, out)
        setDocumentAsync(user, 'data', 'calendar/'+ d.getTime().toString(), out)
        

      })
      calendar2.on('beforeUpdateEvent', (e)=> {
        let event = e.event;
        let changes = e.changes;
        let out = {};
        if (changes.start) out.start = dayjs(changes.start).toDate();
        if (changes.end) out.end = dayjs(changes.end).toDate();
        if (changes.title) out.title = changes.title;
        if (changes.calendarId) out.tag = changes.calendarId;

        updateDocumentAsync(user, 'data', 'calendar/'+ event.id, out)
        

      })
      calendar2.on('beforeDeleteEvent', (e)=> {
        console.log('DELETE', e)
        let d = new Date()
        const out = {'state': 'DONE',
          'doneOn': d
        }
        if (e.location === 'calendar')
        updateDocumentAsync(user, 'data', 'calendar/'+ e.id, out)
        if (e.location === 'task')
          updateDocumentAsync(user, 'data', 'tasks/'+ e.id, out)


      })

      calendar2.on('selectDateTime', (event)=> {
        let out = {};
        
        // if (event.calendarId) out.tag = event.calendarId;
        // if (event.start) out.start = dayjs(event.start).toDate();
        // if (event.end) out.end = dayjs(event.start).toDate();
        // out.state = 'TODO';
        // if (event.description) out.description = event.description;
        // if (event.location) out.location = event.location;
        // if (event.title) out.title = event.title;
        let d = new Date();
        console.log('NewData', event, out)
        // setDocumentAsync(user, 'data', 'calendar/'+ d.getTime().toString(), out)
        

      })
      calendar2.on('clickEvent', (event)=> {
        let out = {};
        
        // if (event.calendarId) out.tag = event.calendarId;
        // if (event.start) out.start = dayjs(event.start).toDate();
        // if (event.end) out.end = dayjs(event.start).toDate();
        // out.state = 'TODO';
        // if (event.description) out.description = event.description;
        // if (event.location) out.location = event.location;
        // if (event.title) out.title = event.title;
        let d = new Date();
        console.log('NewData', event, out)
        // setDocumentAsync(user, 'data', 'calendar/'+ d.getTime().toString(), out)
        

      })
      setCalendar(calendar2)
    }, [])
    useEffect(()=>{
      if (!calendar) return;          
      let startDate = dayjs(calendar.getDateRangeStart());
      let endDate = dayjs(calendar.getDateRangeEnd());
      // console.log(moment(new Date()))
      console.log(startDate, endDate)
      // let scopedTasks = tasks.filter(t=> {
      //   if (!t.scheduled) return false;
      //   let d = dayjs(t.scheduled.seconds*1000 + t.scheduled.nanoseconds);
      //   if (d.isAfter(startDate) && d.isBefore(endDate))
      //     return true;
      //   return false;
      // });
      const scopedTasks = filteredTasks;
      console.log('scoped', scopedTasks)
      const taskevents = scopedTasks.map((t)=>{
        let calendarId = '';
        let start;
        let end;
        if (t.scheduled)
        start = dayjs(t.scheduled.seconds*1000 + t.scheduled.nanoseconds).format('YYYY-MM-DD HH:mm:ss')
        if (t.due)
          end = dayjs(t.due.seconds*1000 + t.due.nanoseconds).format('YYYY-MM-DD HH:mm:ss')
  
        if(t.tags)
          calendarId = t.tags.find(v=>Object.keys(tags.value).includes(v));
        return {
          id: t.id,
          calendarId: calendarId,
          title: t.name,
          location: 'task',
          body: t.description,
          state: 'TODO',
          start: start,
          end: end,
          category: 'task'
        }
        

      });    
      const scopedEvents = filteredCalEvents;
      console.log('scoped', scopedEvents)
      const calevents = scopedEvents.map((t)=>{
        let calendarId = '';
        let start;
        let end;
        
        // console.log(t, t.start, t.end)
        if (t.start)
          start = dayjs(t.start.seconds*1000 + t.start.nanoseconds).format('YYYY-MM-DD HH:mm:ss')
        if (t.end)
          end = dayjs(t.end.seconds*1000 + t.end.nanoseconds).format('YYYY-MM-DD HH:mm:ss')
  
        if(t.tag)
          calendarId = t.tag;
        console.log(t.title, start, end)
        return {
          id: t.id,
          calendarId: calendarId,
          title: t.title,
          location: 'calendar',
          body: t.description,
          state: 'TODO',
          start: start,
          end: end,
          // category: 'task'
        }
        

      });    
      setEvents([...taskevents, ...calevents]);


    }, [calendar, filteredTasks, filteredCalEvents])
    useEffect(()=>{
      if(!calendar) return;
      if (!tasks) return;
    calendar.clear()
    calendar.createEvents(events)
    }, [events])
    useEffect(()=>{
      if (calendar)
      calendar.changeView(calendarView)
    }, [calendarView])

    const setFilteredTasks_n = (docs) => {
        let docs_o = docs;
        let data = [];
        if (stateFilter.length)
            docs = docs.filter((doc) => stateFilter.length && doc.state === stateFilter )
        if (tagsFilter.value.length)
            docs = docs.filter((doc) => tagsFilter.value.length && doc.tags && doc.tags.includes(tagsFilter.value) )
        
        setFilteredTasks(docs)
        return docs_o;
    }

    const setFilteredEvents_n = (docs) => {
      let docs_o = docs;
      let data = [];
      if (stateFilter.length)
          docs = docs.filter((doc) => stateFilter.length && doc.state === stateFilter )
      if (tagsFilter.value.length)
          docs = docs.filter((doc) => tagsFilter.value.length && doc.tag && doc.tag == tagsFilter.value )
      
      setFilteredCalEvents(docs)
      return docs_o;
  }
    const makeFilters = () => {
      return ( <>
        <span> View: </span>

          <Radio.Group value={calendarView} buttonStyle="solid" onChange={(s)=> setCalendarView(s.target.value)}>
    {['day','week', 'month'].map((s)=> <Radio.Button value={s}>{s}</Radio.Button>)}
  </Radio.Group>
        <Button onClick={(e)=> calendar.prev()}>	&lt;</Button>
        <Button onClick={(e)=> calendar.next()}>	&gt;</Button>
        <DatePicker defaultValue={dayjs(new Date())} onChange={(e)=> calendar.setDate(e.toDate())}/>

        {!props.hidetags && <Checkbox onChange={(e)=> setHideTags(e.target.checked)}>Hide Tags</Checkbox>}

        <span> States : </span> <br></br>
    <Radio.Group value={stateFilter} buttonStyle="solid" onChange={(s)=> setStateFilter(s.target.value)}>
    <Radio.Button value='' buttonBg="#000">All</Radio.Button>
    {Object.keys(states) && Object.keys(states).map((s)=> <Radio.Button value={s}>{s}</Radio.Button>)}
  </Radio.Group>
  <br></br>
  {props.hidetags || !hideTags && (
  <div>
        <span> Tags : </span>
    <TagFilter tags={tags} filter={tagsFilter} user={user}/>
  <br></br>
  </div>
  )}
  </>)

    }

    return (
        <BaseLayout {...props} filters={makeFilters()}>
          <div style={{height: '100%', width: '100%', display: 'flex'}}>
                       <div id="calendar" style={{flex: '1 0 auto', minHeight: '100vh'}}></div>
                       </div>
            {/* <Calendar cellRender={cellRender}/> */}
        </BaseLayout>
    )
}

export default TaskCalendar;