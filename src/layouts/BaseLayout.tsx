import React from 'preact';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import Navbar from '../components/Navbar';
import BaseFooter from '../components/Footer';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { getDocumentsAsync } from '../lib/database';
import { UserContext } from '../components/Login';
import {Grid, View, Flex} from '@adobe/react-spectrum';
import '../style/baselayout.css';

const {Text, Link} = Typography;

const { Header, Content, Footer , Sider} = Layout;

const App: React.FC = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const {user} = useContext(UserContext);
  console.log(props.collapsed)
  const {collapsed, setCollapsed} = props.collapsed;

  
  const props_nav = {};
  props_nav.path = props.path;
  props_nav.url = props.url;
  delete props_nav.children;
  const [quote, setQuote] = useState({})
  useEffect(()=>{
      getDocumentsAsync(user, 'data', 'quotes', [getQuote], true)
  }, [Object.keys(quote).length < 1])
  const getQuote = useCallback((docs) =>{
      const doc = docs[Math.floor(Math.random() * docs.length)];
      const data = doc.data();
      setQuote(data);
  }, [])
//   return (
// <Flex direction="row" height="size-2000" gap="size-100" maxWidth="100vw">
//     {/* Sider */}
//   <View minWidth="size-2400">
//   <Navbar {...props_nav} />
//   {props.filters && (
//           <div class="sidebar-filters" style={{height: '100%', overflow: 'scroll', position: 'relative'}}>
//           <div class='sidebar-filters'>
//             <hr></hr>
//             <h4>Filters</h4>
//             {props.filters}</div></div>
//         )
//         } 
//   </View>
//   <View backgroundColor="blue-600" maxWidth="100vw" flex="0 0 100%" flexBasis="100%">
//   {quote && <div> <br></br>
//             <Typography style={{textAlign: 'center'}}><Text strong>Quote Of the Day: </Text> <Text>{quote.text}</Text>
//             {quote.author && <Text italic>- {quote.author}</Text>}
//             </Typography>
//             </div>}
//         {/* <Breadcrumb items={[{title: 'Home'}, {title: 'List'}]} /> */}
//         <div
//           id='content-element'
//           style={{
//             background: colorBgContainer,
//             minHeight: 280,
//             padding: 32,
//             borderRadius: borderRadiusLG,
//             width: '100%'
//           }}
//         >
//           {/* <Children/> */}
//           {props.children}
//         </div>

//      </View>
// </Flex>
//   )
  return (
    <Layout style={{background: '#fff'}}>
            <Sider
      theme='light'
      collapsible 
      collapsed={collapsed} 
      collapsedWidth="0"
      onCollapse={(value) => setCollapsed(value)}
      style={{position: 'fixed', height: '100vh', zIndex: 6}}
    //   style={{ zIndex: 1, opacity: 0.9, overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <Navbar {...props_nav} />

        {props.filters && (
          <div class="sidebar-filters" style={{height: '100%', overflow: 'scroll', position: 'relative'}}>
          <div class='sidebar-filters'>
            <hr></hr>
            <h4>Filters</h4>
            {props.filters}</div></div>
        )
        }
        </Sider>

      <Content style={{ padding: '0 0px' , marginTop: 20, marginLeft: 'auto', marginRight: 'auto', maxWidth: 1280, minWidth: '80vw'}}>
      {quote && <div> <br></br>
            <Typography style={{textAlign: 'center'}}><Text strong>Quote Of the Day: </Text> <Text>{quote.text}</Text>
            {quote.author && <Text italic>- {quote.author}</Text>}
            </Typography>
            </div>}
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
    </Layout>
  );
};

export default App;