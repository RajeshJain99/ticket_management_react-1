
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom'
import { data } from 'jquery';
import Select from 'react-select'
import validator from 'validator'

export default function CreateUser() {
    const { id } = useParams();
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
    const [filterBranch, setFilterBranch] = React.useState([]);
    const [originalEmail, setOriginalEmail] = React.useState('');
    let branch_data = []

    const adjustValue = value => {
        setCompanyId(value)
        setBranchId('')
        setFilterBranch(branch.filter(item => item.company_id == value.value))
    }

    const changeBranch = value => {
        setBranchId(value)
        setFilterBranch(branch.filter(item => item.company_id == companyid.value))
    }


    React.useEffect(() => {

        async function FetchDropDownData() {
            const response = await fetch(url + 'fetchCompaniesRoleBranch/', {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()
                console.log(data);
                if (data.status == 200) {
                    let role = data.role_data;
                    let company = data.companies_data;
                    let branch1 = data.branch_data;

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
                    branch_data = branch1.map(item => {
                        return {
                            value: item.id,
                            label: item.name,
                            company_id: item.company_id
                        }
                    })
                    setBranch(branch_data)
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message)
                }
            }
        }
        FetchDropDownData();

        async function FetchUserData() {
            const response = await fetch(url + 'edit/user/' + id, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    let userData = data.user_data;
                    SetFirstName(userData.fname);
                    setLastName(userData.lname);
                    setMobileno(userData.mobile);
                    setEmail(userData.email);
                    setOriginalEmail(userData.email)
                    let branch_ids = []
                    let branch_name = []

                    branch_ids = userData?.branchid?.split(',');
                    branch_name = userData?.branchname?.split(',');
                    setCompanyId({
                        value: userData.companyid,
                        label: userData.companyname

                    })
                    setFilterBranch(branch_data.filter(item => {
                        if (item.company_id == userData.companyid) {
                            if (!branch_ids.includes(item.value.toString())) {
                                return item
                            }
                        }
                    }))
                    setRoleId({
                        value: userData.roleid,
                        label: userData.rolename
                    })

                    let dict_list = []

                    for (let i = 0; i < branch_ids?.length; i++) {
                        dict_list.push({
                            value: branch_ids[i],
                            label: branch_name[i]
                        })
                    }
                    setBranchId(dict_list)
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404';
                }
                else {
                    toast.error(data.message)
                }
            }
        }

        FetchUserData()
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        if (companyid && roleid && branchid) {
            if (validator.isMobilePhone(mobileno)) {
                async function sumbitUser() {
                    const formData = new FormData();
                    formData.append('fname', firstName)
                    formData.append('lname', lastName)
                    formData.append('email', email)
                    formData.append('mobile', mobileno)
                    formData.append('roleid', roleid.value)
                    formData.append('companyid', companyid.value)
                    formData.append('branchid', JSON.stringify(branchid))
                    formData.append('user_id', id)
                    const response = await fetch(url + 'updateUser/', {
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
                        } else if (data.status == 404) {
                            return window.location = window.location.origin + '/#/404'
                        } else {
                            setEmail(originalEmail);
                            toast.error(data.message)
                        }
                    }
                }
                sumbitUser()
            } else {
                toast.error('Invaild Mobile Number')
            }
        } else {
            toast.error('Select Dropdown Values')
        }



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
                                <Select isMulti options={filterBranch} value={branchid} onChange={changeBranch} />
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
