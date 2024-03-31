import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
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
        <Footer style={{ textAlign: 'center' }}>
        Made with <HeartFilled/> by <a href="https://portfolio.sidhartharya.com">Sidharth Arya</a> ©{new Date().getFullYear()}
      </Footer>
    )
}

export default BaseFooter;