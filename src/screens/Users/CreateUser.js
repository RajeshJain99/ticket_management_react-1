
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select'
import validator from 'validator'
import Loader from 'src/components/Loader'

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
    const [filterBranch, setFilterBranch] = React.useState([]);
    const [roleid, setRoleId] = React.useState('');
    const [companyid, setCompanyId] = React.useState('');
    const [branchid, setBranchId] = React.useState('');
    const [loading,setLoading]= React.useState(false);

    const adjustValue = value => {
        setCompanyId(value)
        setFilterBranch(branch.filter(item => item.company_id == value.value))
    }

    React.useEffect(() => {
        setLoading(true);
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
                    setCompany(company.map(item => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }))
                    setRole(role.map(item => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }))
                    setBranch(branch.map(item => {
                        return {
                            value: item.id,
                            label: item.name,
                            company_id: item.company_id
                        }
                    }))
                    setLoading(false);
                } else if (data.status == 404) {
                    window.location = window.location.origin + '/#/404';
                }
                else {
                  toast.error(data.message)
                  setLoading(false);
                }
            }
        }
        FetchDropDownData()
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        if (companyid && roleid && branchid) {
            if (validator.isMobilePhone(mobileno)) {
                setLoading(true);
                async function sumbitUser() {
                    const formData = new FormData();
                    formData.append('fname', firstName)
                    formData.append('lname', lastName)
                    formData.append('email', email)
                    formData.append('mobile', mobileno)
                    formData.append('roleid', roleid.value)
                    formData.append('companyid', companyid.value)
                    formData.append('branchid', JSON.stringify(branchid))

                    const response = await fetch(url + 'createUser/', {
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
                            setLoading(false);
                        }
                    }
                }
                sumbitUser()
            } else {
                toast.error("Invalid Mobile Number")
            }
        }
        else {
            toast.error('Select Dropdown Values')
        }

    }


    return (
         <section>
            {loading && <Loader/>}
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
                                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Company</label>
                                <Select options={company} value={companyid} onChange={adjustValue} />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Role</label>
                                <Select options={role} value={roleid} onChange={setRoleId} />
                            </div>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Select Branch</label>
                                <Select isMulti options={filterBranch} value={branchid} onChange={setBranchId} />
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
