import { useContext, useEffect, useState } from 'preact/hooks';
import BaseLayout from '../layouts/BaseLayout';
import { UserContext } from '../components/Login';
import { getDocumentsAsync } from '../lib/database';
import { Typography } from 'antd';
const {Text, Link} = Typography;
const Home = (props) => {
    const {user} = useContext(UserContext);

    return (
    <BaseLayout {...props}>

    Need to have a dashboard here. Except for this currently the tracking stuff works
    </BaseLayout>
    )
}

export default Home;