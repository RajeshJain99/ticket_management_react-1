import React from 'react'

export default function Smtp() {
    const [provider, setProviderName] = React.useState('');
    const [hostName, setHostName] = React.useState('');
    const [port, setPortName] = React.useState('');
    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <div>
            <h3 id="MailId" >Mail SMPT Configuration</h3>
            <br />
            <div className="container">
                <form>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Provider</label>
                                <select className="form-control">
                                    <option value="">selectvalue1</option>
                                    <option value="">selectvalue1</option>
                                    <option selected value="">selectvalue1</option>
                                    <option value="">selectvalue1</option>
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
          
                 </div>
                </form>

            </div>
        </div>
    )
}


