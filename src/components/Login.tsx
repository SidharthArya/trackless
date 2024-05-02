import { createContext } from 'preact';
import { useState, useEffect, useRef, useContext } from 'preact/hooks';
import { Flex, Radio, Button, Typography, Card, Input, Form } from 'antd';
import '../app.css';
import { login } from '../lib/database';

type FieldType = {
    username?: string;
    password?: string;
    // remember?: string;
  };

let user = localStorage.getItem('user');
if(user)
  user = JSON.parse(user).user;
export const UserContext = createContext(user);

const Login = (props: any) => {
    const {user, setUser} = useContext(UserContext);
    console.log(user, setUser);


    const handleLogin = (event) => {
        // const email = emailRef.current.value;
        // const password =  passwordRef.current.value;
        let u = login(email.value, password.value, setUser);
        console.log('User', user, u, !u.error)
        // if (!u.error) setUser(u)
        // console.log(user, u)
      };

    
  return (
    <Flex>
        <Card title='Login' style={{position: 'relative', left: '50vw', top: '50vh', height: 'fit-content', transform:'translateX(-50%) translateY(-50%)'}} hoverable>
        <Typography>
    <div style={{textAlign: 'center'}}>
      <img src='https://portfolio.sidhartharya.com/logo.png' style={{width: '3rem', height: '3rem', margin: '0 auto'}}/>
      <h4 style={{textAlign: 'right'}}>Welcome to my tracking system</h4>
      </div>
      <br></br>
    <Form name='loginForm' onFinish={handleLogin} style={{margin: '0 auto', position:'relative'}}>
    <Form.Item<FieldType>
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input name='email' placeholder='Email Address' id="email" aria-describedby="email" type='text'/>
      </Form.Item>
      <Form.Item<FieldType>
      name="password"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input name='password' id="password" placeholder='Password' aria-describedby="password" type='password' />
      </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType='submit'>Login</Button>
      </Form.Item>
    </Form>
    </Typography>
    </Card>
    
            </Flex>
  );
};

export default Login;