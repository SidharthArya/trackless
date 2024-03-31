import BaseLayout from '../layouts/BaseLayout';
import { Typography } from 'antd';

const NotFound = (props) => {
    return (
    <BaseLayout {...props}>
        <Typography>
        <div style={{width: '100%', textAlign: 'center'}}>
        <h1 style={{color: '#993456'}}>404!</h1>
        <h2 style={{color: '#663456'}}>Page Not Found</h2>

        <div style={{ display: 'inline-block', margin: '0 auto', borderRadius: '10%', overflow: 'hidden'}}>
        <img src='/404.webp' style={{width: '300px'}}/>
        </div>
        <br></br>
        <h4 style={{color: '#223456'}}> Sorry, this page is not available on Earth. <br></br>If you plan on going to Space,<br></br> please include me in that plan?</h4>
        </div>
        </Typography>
    
    </BaseLayout>
    )
}

export default NotFound;