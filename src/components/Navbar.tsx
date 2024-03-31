import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const items = [
    {
        key: 'Tracking',
        label: <span style={{color: 'black', fontWeight: 1000}}>Tracking</span>
    },
    {
        key: 'home',
        label: <a href='/home'>Home</a>,
    },
    {
        label: "Exercise",
        key: 'exercise',
        children: [
            {label: <a href='/exercise/progress'>Progress</a>},
            {label: <a href='/exercise/today'>Today</a>}
        ]
    },
    {
        label: "Tracking",
        key: 'tracking',
        children: [
            {label: <a href='/tracking/progress'>Progress</a>},
            {label: <a href='/tracking/today'>Today</a>}
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
        <Header style={{ display: 'flex', alignItems: 'center', background: colorBgContainer}}>
{/*             
        <div className="demo-logo" style={{color: 'white', fontWeight: 1000}}>
            <img style={{height: 50}} src='/logo.png'/>
            <span >Tracking</span>
        </div> */}
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          selectedKeys={[props.path ? props.path.split('/')[1] : '0']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
    )
}

export default Navbar