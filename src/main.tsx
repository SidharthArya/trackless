import { h, render, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';
import { App } from './app.tsx';
import './index.css'
import Router from 'preact-router';
import Home from './pages/Home';
import Login, {UserContext} from './components/Login';
import ExerciseProgress from './pages/exercise/Progress';
import ExerciseToday from './pages/exercise/Today.tsx';
import NotFound from './pages/404.tsx';
import Lapper from './pages/Lapper.tsx';
import TrackingProgress from './pages/tracking/Progress'


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
      <TrackingProgress path="/tracking/progress"/>
      {/* <ExerciseToday path="/exercise/today"/> */}
      <Lapper path="/lapper"/>
      <NotFound type="404" default/>
    </Router>
    </UserContext.Provider>

    )
    };
  

// render(<App />, document.getElementById('app')!)
render(<Main />, document.body);
