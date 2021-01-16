
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom'
import { data } from 'jquery';

export default function CreateUser() {
    const { id } = useParams();
    const history = useHistory();
    const { user } = React.useContext(userContext);
   const[firstName,SetFirstName]= React.useState('');
    const[lastName,setLastName]= React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobileno, setMobileno] = React.useState('');
    const [role, setRole] = React.useState([]);
    const [company, setCompany] = React.useState([]);
    const [branch, setBranch] = React.useState([]);
    const [roleid,setRoleId] =React.useState('');
    const [companyid,setCompanyId]= React.useState('');
    const [branchid, setBranchId] = React.useState('');

   React.useEffect(() => {

        async function FetchDropDownData() {
            const response = await fetch(url + '', {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    let role = data.role_list;
                    let company= data.company_list;
                    let departmnet= data.department_list;
                    let branch = data.branch_list;

                      setRole(role);
                      setCompany(company);
                      setBranch(branch);

                } else if (data.status ==404){
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message)
                }
            }
        }
         async function FetchUserData() {
            const response = await fetch(url + '', {
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
                       setRoleId(userData.roleid);
                       setCompany(userData.companyid);
                        setBranch(userData.branchid);
                } else if (data.status==404){
                    return window.location= window.location.origin + '/#/404';
                }
                  else {
                    toast.error(data.message)
                }
            }
        }
        FetchDropDownData()
        FetchUserData()
    })

    const handleSubmit = e => {
        e.preventDefault();
       
            async function sumbitUser() {
                const formData = new FormData();
                formData.append('fname',firstName)
                formData.append('lname',lastName)
                formData.append('email', email)
                formData.append('mobile', mobileno)
                formData.append('roleid', roleid)
                formData.append('comapnyid', companyid)
                formData.append('branchid', branchid)
                formData.append('user_id', id)

                const response = await fetch(url + '', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.token,
                    },
                    body: formData
                })

                if (response.ok == true) {
                    return history.push('/userList/')
                } else if (data.status==404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message)
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
                                        <option value={item.id}>{item.company_name}</option>
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
                                        <option value={item.id}>{item.role_name}</option>
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
                                        <option value={item.id}>{item.branch_name}</option>
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
