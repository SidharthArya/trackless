import { useContext, useEffect, useState } from 'preact/hooks';
import BaseLayout from '../../layouts/BaseLayout';
import { getDocumentsAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import { Select, Button, Input, Card, Typography, Form } from 'antd';
import AddButton from '../../components/AddButton';



const Settings = (props) => {
    const [settings, setSettings] = useState();
    const { user } = useContext(UserContext);
    const handleNewData = ()=> {}
    useEffect(()=>{
        getDocumentsAsync(user, 'settings', 'exercises', [setSettings], false, -1)
        console.log('Settings', settings)
    }, [])
    return (
        <BaseLayout {...props}>
            {settings && settings.map((setting)=>{
                return (
                    <div>{setting.id}
                    {Object.keys(setting).map((k)=>{
                        if (k !== 'id')
                        return <div>{k}</div>

                    })}
                    </div>
                )
            }
            )}
            <AddButton name="tasks" user={user}>
<Select>
    <Select.Option>Category</Select.Option>
    <Select.Option>Type</Select.Option>
</Select>
<Input label="state" name='state' style={{display: 'none'}} placeholder="state"/>

<Input label="name" name="name" placeholder="name" style={{marginTop: 10, marginBottom: 10}}/>
<Input label="description" name="description" placeholder="description" style={{marginTop: 10, marginBottom: 10}} />
<Input label="tags" name='tags' style={{display: 'none'}} placeholder="name"/>

</AddButton>
        </BaseLayout>
    )
}

export default Settings;