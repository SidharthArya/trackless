import React from 'preact';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import Navbar from '../components/Navbar';
import BaseFooter from '../components/Footer';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { getDocumentsAsync } from '../lib/database';
import { UserContext } from '../components/Login';
import NoteEditor from '../components/NoteEditor';

const {Text, Link} = Typography;

const { Header, Content, Footer , Sider} = Layout;

const App: React.FC = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const {user} = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedR, setCollapsedR] = useState(true);
  const [now, setNow] = useState(props.now ? props.now : undefined);

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
  useEffect(()=> {
    setNow(props.now)
    if (props.now) setCollapsedR(false)

  }, [props])
useEffect(()=> {
    const rsidebar = document.getElementsByTagName('aside')[1];
    if (!collapsedR)
    setTimeout(()=> {
        rsidebar.style.maxWidth = '100vw';
        rsidebar.style.minWidth = '50vw';

    }, 500);

}, [collapsedR])

useEffect(()=> {
    if(now)
    setCollapsedR(false)
    
   console.log('Here2', now)
}, [now])

  return (
    <Layout style={{background: '#fff'}}>
    <Sider
      collapsible 
      collapsed={collapsed} 
      collapsedWidth="0"
      onCollapse={(value) => setCollapsed(value)}
      theme='light'
      style={{position: 'fixed', height: '100vh', zIndex: 3}}
    //   style={{ zIndex: 1, opacity: 0.9, overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <Navbar {...props_nav} />
        {props.filters && (
          <div class="sidebar-filters" style={{height: '100%', overflow: 'scroll', position: 'relative'}}>

          <div class='sidebar-filters'>
            <hr></hr>
            <h4>Filters</h4>
            {props.filters()}</div></div>
        )}
        </Sider>
      <Content style={{ padding: '0 0px' , marginTop: 20, marginLeft: 'auto', marginRight: 'auto', maxWidth: 1280, minWidth: '80vw'}}>
      {quote && <div> <br></br>
            <Typography onClick={()=> {props.setEditorId(''); setCollapsedR(true)}} style={{textAlign: 'center', zIndex: 2, position: 'relative'}}><Text strong>Quote Of the Day: </Text> <Text>{quote.text}</Text>
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
      <Sider
      theme='light'
      collapsible 
      collapsed={collapsedR} 
      collapsedWidth="0"
      onCollapse={(value) => setCollapsed(value)}
      style={{position: 'fixed', height: '100vh', zIndex: 2, right: 0, maxWidth: '100vw', minWidth: '50vw', color: '#000', overflowY: 'scroll', scrollbarWidth: 'none'}}
    //   style={{ zIndex: 1, opacity: 0.9, overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >   
      {props.now && props.now.length > 0 &&(
    <NoteEditor {...{now: now == "new"? undefined : props.now}} />
      )}
       </Sider>
    </Layout>
  );
};

export default App;