
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';

export default function CreateUser() {
    const history = useHistory();
    const { user } = React.useContext(userContext);
    const [firstName, SetFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobileno, setMobileno] = React.useState('');
    const [role, setRole] = React.useState([]);
    const [company, setCompany] = React.useState([]);
    const [branch, setBranch] = React.useState([]);
    const [roleid, setRoleId] = React.useState('');
    const [companyid, setCompanyId] = React.useState('');
    const [branchid, setBranchId] = React.useState('');
    
   React.useEffect(() => {

        async function FetchDropDownData() {
            const response = await fetch(url + 'fetchCompaniesRoleBranch/', {
                headers: {
                    'Authorization': user?.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    let role = data.role_data;
                    let company = data.companies_data;
                    let branch = data.branch_data;

                    setRole(role);
                    setCompany(company);
                    setBranch(branch);

                } else if (data.status == 404) {
                    window.location = window.location.origin + '/#/404';
                }
                else {
                    toast.error('Unable to fetch the data please reload the page or try again later')
                }
            }
        }
        FetchDropDownData()
    }, [])

    const handleSubmit = e => {
        e.preventDefault();

        async function sumbitUser() {
            const formData = new FormData();
            formData.append('fname', firstName)
            formData.append('lname', lastName)
            formData.append('email', email)
            formData.append('mobile', mobileno)
            formData.append('roleid', roleid)
            formData.append('comapnyid', companyid)
            formData.append('branchid', branchid)

            const response = await fetch(url + '', {
                method: 'POST',
                headers: {
                    'Authorization': user.token,
                },
                body: formData
            })

            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    return history.push('/userList/')
                }
                else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404';
                }
                else {
                    toast.error(data.message)
                }
            }
        }
        sumbitUser()
    }


    return (

        <section>
            <ToastContainer />
            <div className="container">
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">First Name</label>
                                <input required value={firstName} onChange={e => SetFirstName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Last Name</label>
                                <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Mobile No.</label>
                                <input required value={mobileno} onChange={e => setMobileno(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Email</label>
                                <input required value={email} onChange={e => setEmail(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Company</label>
                                <select className="form-control" required onChange={e => setCompanyId(e.target.companyid)} >
                                    <option>Select Company</option>
                                    {company?.map(item => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Role</label>
                                <select className='form-control' required onChange={e => setRoleId(e.target.value)} >
                                    <option>Select Role</option>
                                    {role?.map(item => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Branch</label>
                                <select className="form-control" required onChange={e => setBranchId(e.target.branchid)} >
                                    <option>Select Branch</option>
                                    {branch?.map(item => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="row mt-4 big-btn-div">
                        <button type='submit' className='btn btn-success'>Submit</button>
                    </div>

                 
                </form>
            </div>
        </section>
    )
}
