import { Breadcrumb, Layout, Menu,MenuItemProps, theme } from 'antd';
import { useState } from 'preact/hooks';
import BaseFooter from './Footer';
import { ActionButton } from '@adobe/react-spectrum';
import {SubmenuTrigger, MenuTrigger, Item} from '@react-spectrum/menu';
import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';




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
            {label: <a href='/notes/list' accesskey="n">Notes</a>},
            {label: <a href='/notes/graph' accesskey="g">Graph</a>},
            {label: <a href='/notes/revise' accesskey="r">Revise</a>},
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
//     return (
//         <sp-sidenav variant="multilevel" defaultValue="Layout" style={{maxWidth: '100%'}}>
//     <sp-sidenav-item value="Home" label="Home" href="/home">
//     </sp-sidenav-item>
//     <sp-sidenav-item value="Exercise" label="Exercise">
//         <sp-sidenav-item value="Progress" label="Progress" href="/exercise/progress"></sp-sidenav-item>
//         <sp-sidenav-item value="Today" label="Today" href="/exercise/today"></sp-sidenav-item>
//         <sp-sidenav-item value="Settings" label="Settings" href="/exercise/settings"></sp-sidenav-item>
//         <sp-sidenav-item value="Grid" label="Grid" expanded>
//             <sp-sidenav-item value="Layout" label="Layout">
//             </sp-sidenav-item>
//             <sp-sidenav-item value="Responsive" label="Responsive">
//             </sp-sidenav-item>
//         </sp-sidenav-item>
//         <sp-sidenav-item value="Typography" label="Typography">
//         </sp-sidenav-item>
//     </sp-sidenav-item>
//     <sp-sidenav-item value="Elements" label="Elements">
//     </sp-sidenav-item>
//     <sp-sidenav-item value="Patterns" label="Patterns">
//     </sp-sidenav-item>
// </sp-sidenav>
//       )
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