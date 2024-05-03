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
let userL = localStorage.getItem('user');
if(userL) 
    userL = JSON.parse(userL).user;
// const ThemeContext = createContext(user);

const Main = () => {
    const [user, setUser] = useState(userL);
    // const theme = useContext(ThemeContext);
    if (!user)
        return ( 
        <UserContext.Provider value={{user, setUser}}>
        <Login/>
        </UserContext.Provider>
        )
    return (
        <UserContext.Provider value={{user, setUser}}>

    <Router>
      <Home path="/" />
      <Home path="/home" />
      <ExerciseProgress path="/exercise/progress"/>
      <ExerciseToday path="/exercise/today"/>
      <ExerciseSettings path="/exercise/settings"/>
      <TrackingProgress path="/tracking/progress"/>
      <TrackingToday path="/tracking/today"/>
      <TaskList path='/tasks/list'/>
      <TaskCalendar path='/tasks/calendar'/>
      <NotesList path='/notes/list'/>
      <NotesDump path='/notes/dump'/>
      <NotesRevise path='/notes/revise'/>
      <NotesGraph path='/notes/graph'/>
      <Quote path='/notes/quote'/>
      <Note path='/notes/note'/>
      <EditorLink path='/notes/backends/editorLink'/>
      {/* <ExerciseToday path="/exercise/today"/> */}
      <Lapper path="/lapper"/>
      <NotFound type="404" default/>
    </Router>
    </UserContext.Provider>

    )
    };
  

// render(<App />, document.getElementById('app')!)
render(<Main />, document.body);
