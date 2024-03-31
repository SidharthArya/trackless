import React from 'preact';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Navbar from '../components/Navbar';
import BaseFooter from '../components/Footer';



const { Header, Content, Footer } = Layout;


const App: React.FC = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const props_nav = {};
  props_nav.path = props.path;
  props_nav.url = props.url;
  delete props_nav.children;

  return (
    <Layout style={{background: '#fff'}}>
        <Navbar {...props_nav} />
      <Content style={{ padding: '0 0px' , marginTop: 20, marginLeft: 'auto', marginRight: 'auto', maxWidth: 1280, minWidth: '80vw'}}>
        {/* <Breadcrumb items={[{title: 'Home'}, {title: 'List'}]} /> */}
        <div
          id='content-element'
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 32,
            borderRadius: borderRadiusLG,
            width: '100%'
          }}
        >
          {/* <Children/> */}
          {props.children}
        </div>
      </Content>
    <BaseFooter/>
    </Layout>
  );
};

export default App;