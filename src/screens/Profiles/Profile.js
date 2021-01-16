import React, { useContext, useEffect } from 'react'
import { userContext } from 'src/context/UserContext'
import validator from 'validator';
import { toast, ToastContainer } from 'react-toastify';
import { url } from 'src/helpers/Helpers';



export default function Profile() {
    const [Name, setName] = React.useState('');
    const [Email, setEmail] = React.useState('');
    const [MobileNo, setMobileNo] = React.useState('');
    const [Password, setPassword] = React.useState('');
    const [ConfirmPassword, setConfirmPassword] = React.useState('');
    const [ShowError, SetShowError] = React.useState(false);
    const { user } = useContext(userContext);

    useEffect(() => {
        let lname = user.userData.lname != null ? user.userData.lname : ''
        setName(user.userData.fname + ' ' + lname);
        setEmail(user.userData.email);
        setMobileNo(user.userData.mobile);
    }, [])

    const handleSubmit = e => {
        SetShowError(false);
        e.preventDefault();
        if (Password != null && ConfirmPassword != null) {
            if (Password == ConfirmPassword) {
                if (validator.isMobilePhone(MobileNo)) {
                    async function SaveProfileData() {

                        const formData = new FormData();
                        formData.append('name', Name)
                        formData.append('mobile', MobileNo)
                        formData.append('password', Password)
                        formData.append('id', user.userData.id)

                        const response = await fetch(url + 'edit/user/', {
                            method: "POST",
                            headers: {
                                "Authorization": user.token
                            },
                            body: formData
                        })

                        if (response.ok == true) {
                            const data = await response.json()
                            if (data.status == 200) {
                                toast.success("Information updated successfully")
                                setTimeout(() => {
                                    return window.location.reload()
                                }, 3000)
                            } else if (data.status == 500) {
                                toast.error(data.message)
                            }
                            else if (data.status == 404) {
                                return window.location = window.location.origin + '/#/404';
                            }

                        }
                    }
                    SaveProfileData()
                }
                else {
                    toast.error('Invalid Mobile Number')
                }

            }
            else {
                SetShowError(true);
            }
        }
    }

    return (
        <div>
            <ToastContainer />
            <form onSubmit={e => handleSubmit(e)}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Name</label>
                            <input value={Name} required onChange={e => setName(e.target.value)} type="text" className="form-control" required />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Email</label>
                            <input value={Email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" required readOnly />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Mobile No.</label>
                            <input value={MobileNo} onChange={e => setMobileNo(e.target.value)} type="text" maxLength="10" className="form-control" required />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Password</label>
                            <input value={Password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" required />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input value={ConfirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" className="form-control" required />
                        </div>
                        {ShowError && <div className="input-error">Password Does Not Match</div>}
                    </div>
                </div>
                <div>
                    <button className="btn btn-primary" type="submit">Sumbit</button>
                </div>
            </form>

        </div>
    )
}
