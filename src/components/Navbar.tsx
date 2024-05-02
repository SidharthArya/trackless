import { Breadcrumb, Layout, Menu,MenuItemProps, theme } from 'antd';
import { useState } from 'preact/hooks';
import BaseFooter from './Footer';

const { Header, Content, Footer, Sider } = Layout;


const items:MenuItemProps = [
    {
        key: 'Tracking',
        label: <span style={{color: 'white', fontWeight: 1000}}>Tracking</span>
    },
    {
        key: 'home',
        label: <a href='/home'>Home</a>,
    },
    {
        label: "Exercise",
        key: 'exercise',
        children: [
            {label: <a href='/exercise/progress' accesskey="E">Progress</a>},
            {label: <a href='/exercise/today' accesskey="e">Today</a>},
            {label: <a href='/exercise/settings'>Settings</a>}
        ]
    },
    {
        label: "Tracking",
        key: 'tracking',
        children: [
            {label: <a href='/tracking/progress'>Progress</a>},
            {label: <a href='/tracking/today'>Today</a>}
        ]
    },    {
        label: "Tasks",
        key: 'tasks',
        children: [
            {label: <a href='/tasks/list' accesskey="t">Tasks</a>},
            {label: <a href='/tasks/calendar' accesskey="c">Calendar</a>}
        ]
    },
    {
        label: "Notes",
        key: 'notes',
        children: [
            {label: <a href='/notes/dump' accesskey="N">Dump</a>},
            {label: <a href='/notes/list'>Notes</a>},
            {label: <a href='/notes/graph' accesskey="g">Graph</a>},
            {label: <a href='/notes/revise'>Revise</a>},
            {label: <a href='/notes/quote'>Quote</a>},
        ]
    },
    {
        label: "News",
        key: 'news',
        children: [
            {label: <a href='/news/list' accesskey="k">News</a>},
            {label: <a href='/news/add'>Add</a>},
        ]
    },
    {
        key: 'lapper',
        label: <a href='/lapper'>Lapper</a>,
    },
]; 


const Navbar = (props) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    // let base =  window.location.href.replace(`${window.location.protocol}//${window.location.hostname}${window.location.port? ':' + window.location.port :''}`, '')
    return (

<>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['home']}
          theme="light"
            mode="inline"
          selectedKeys={[props.path ? props.path.split('/')[1] : '0']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          forceSubMenuRender={true}
        />
        
        {/* <BaseFooter/> */}
        </>
    )
}

export default Navbar