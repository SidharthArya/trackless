import { useContext, useEffect, useState } from 'preact/hooks';
import BaseLayout from '../layouts/BaseLayout';
import { UserContext } from '../components/Login';
import { getDocumentsAsync } from '../lib/database';
import { Typography } from 'antd';
import Area from '../components/Graph/Area';
const {Text, Link} = Typography;
const Home = (props) => {
    const {user} = useContext(UserContext);
    console.log('Homeprops', props)
    return (
    <BaseLayout {...props}>

    {/* Need to have a dashboard here. Except for this currently the tracking stuff works */}
    {/* <Area></Area> */}
    </BaseLayout>
    )
}

export default Home;