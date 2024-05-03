import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import {
    HomeOutlined,
    LoadingOutlined,
    SettingFilled,
    SmileOutlined,
    SyncOutlined,
    HeartFilled
  } from '@ant-design/icons';

const BaseFooter = (props) => {
    return (
        <div style={{ textAlign: 'center', color: 'white' }}>
        Made with <HeartFilled/> by <a href="https://portfolio.sidhartharya.com">Sidharth Arya</a> ©{new Date().getFullYear()}
      </div>
    )
}

export default BaseFooter;