import { h, render, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';
import { App } from './app.tsx';

import './index.css'
import Router from 'preact-router';
import Home from './pages/Home';
import Login, {UserContext} from './components/Login';
import ExerciseProgress from './pages/exercise/Progress';
import ExerciseToday from './pages/exercise/Today.tsx';
import TrackingToday from './pages/tracking/Today.tsx';
import NotFound from './pages/404.tsx';
import Lapper from './pages/Lapper.tsx';
import TrackingProgress from './pages/tracking/Progress';
import TaskList from './pages/tasks/List';
import NotesList from './pages/notes/List';
import NotesDump from './pages/notes/Dump';
import NotesGraph from './pages/notes/Graph';
import NotesRevise from './pages/notes/Revise';
import Quote from './pages/notes/Quote';
import EditorLink from './pages/notes/backends/editorLink.tsx';
import TaskCalendar from './pages/tasks/Calendar';
import Note from './pages/notes/Note';
import ExerciseSettings from './pages/exercise/Settings';
import Navbar from './components/Navbar.tsx';
import {defaultTheme, Provider} from '@adobe/react-spectrum';
import { ConfigProvider } from 'antd';
let userL = localStorage.getItem('user');
if(userL) 
    userL = JSON.parse(userL).user;
// const ThemeContext = createContext(user);
const antTheme = {
    token: {
        fontFamily: 'Adobe-Clean',
      // Seed Token
      colorPrimary: '#00b96b',
    //   borderRadius: 2,

      // Alias Token
    //   colorBgContainer: '#f6ffed',
    },
  };
const Main = (props) => {
    const [user, setUser] = useState(userL);
    const [collapsed, setCollapsed] = useState(true)
    // const theme = useContext(ThemeContext);
    console.log('mainprops', props)


    if (!user)
        return ( 
            <ConfigProvider
            theme={antTheme}
          >
            <Provider theme={defaultTheme}>
        <UserContext.Provider value={{user, setUser}}>
        <Login/>
        </UserContext.Provider>
        </Provider>
        </ConfigProvider>
        )
    return (
        <ConfigProvider
    theme={antTheme}
  >
        <Provider theme={{...defaultTheme, fontFamily: 'Adobe-Clean'}}>
        <UserContext.Provider value={{user, setUser}}>

    <Router>
      <Home path="/" collapsed={{collapsed, setCollapsed}}/>
      <Home path="/home" collapsed={{collapsed, setCollapsed}}/>
      <ExerciseProgress path="/exercise/progress" collapsed={{collapsed, setCollapsed}}/>
      <ExerciseToday path="/exercise/today" collapsed={{collapsed, setCollapsed}}/>
      <ExerciseSettings path="/exercise/settings" collapsed={{collapsed, setCollapsed}}/>
      <TrackingProgress path="/tracking/progress" collapsed={{collapsed, setCollapsed}}/>
      <TrackingToday path="/tracking/today" collapsed={{collapsed, setCollapsed}}/>
      <TaskList path='/tasks/list' collapsed={{collapsed, setCollapsed}}/>
      <TaskCalendar path='/tasks/calendar' collapsed={{collapsed, setCollapsed}}/>
      <NotesList path='/notes/list' collapsed={{collapsed, setCollapsed}}/>
      <NotesDump path='/notes/dump' collapsed={{collapsed, setCollapsed}}/>
      <NotesRevise path='/notes/revise' collapsed={{collapsed, setCollapsed}}/>
      <NotesGraph path='/notes/graph' collapsed={{collapsed, setCollapsed}}/>
      <Quote path='/notes/quote' collapsed={{collapsed, setCollapsed}}/>
      <Note path='/notes/note' collapsed={{collapsed, setCollapsed}}/>
      <EditorLink path='/notes/backends/editorLink' collapsed={{collapsed, setCollapsed}}/>
      {/* <ExerciseToday path="/exercise/today"/> */}
      <Lapper path="/lapper" collapsed={{collapsed, setCollapsed}}/>
      <NotFound type="404" default collapsed={{collapsed, setCollapsed}}/>
    </Router>
    </UserContext.Provider>
    </Provider>
</ConfigProvider>
    )
    };
  

// render(<App />, document.getElementById('app')!)
render(<Main />, document.body);
