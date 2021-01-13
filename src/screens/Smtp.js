import React from 'react'
import { url } from 'src/helpers/Helpers';
import { toast, ToastContainer } from 'react-toastify';
import { userContext } from './../context/UserContext'


export default function Smtp() {
    const { user } = React.useContext(userContext);
    const [provider, setProviderName] = React.useState([]);
    const [hostName, setHostName] = React.useState('');
    const [port, setPortName] = React.useState('');
    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [providerid, setProviderId] = React.useState('');
    React.useEffect(() => {

        async function FetchProviderData() {
            const response = await fetch(url + 'fetchMailProviders/', {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    let ProviderData = data.provider_list;
                      setProviderName(ProviderData);
                } else {
                    toast.error('Unable to fetch the data please reload the page or try again later')
                }
            }
        }
        FetchProviderData()
    })
    const handleSubmit = e => {
        e.preventDefault();
     }

    return (
        <div>
            <h3 id="MailId" >Mail SMPT Configuration</h3>
            <br />
            <div className="container">
                <form onSubmit={e => handleSubmit(e)} >
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Provider</label>
                                <select className='form-control' required value={providerid} onChange={e => setProviderId(e.target.value)} >
                                    <option>Select Provider</option>
                                    {provider?.map(item => (
                                        <option value={item.id}>{item.provider_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Host Name</label>
                                <input required value={hostName} onChange={e => setHostName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Port</label>
                                <input required value={port} onChange={e => setPortName(e.target.value)} type="number" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">User Name</label>
                                <input required value={username} onChange={e => setUserName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" >
                                <label htmlFor="">Password</label>
                                <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 big-btn-div">
                    <button type='submit' className='btn btn-success'>Submit</button>
                </div>
                </form>
                
            </div>
        </div>
    )
}


