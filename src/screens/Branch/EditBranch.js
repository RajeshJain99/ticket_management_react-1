import { ready } from 'jquery';
import React from 'react'
import { userContext } from '../../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import { fetchContext } from '../../context/FetchContext'
import { useHistory ,useParams } from 'react-router-dom';
import {url} from  'src/helpers/Helpers';
import validator from 'validator'



export default function CreateBranch() {
     const { id } = useParams();
    const [branchName, setBranchName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [countryId, setCountryId] = React.useState('');
    const [stateId, setStateId] = React.useState('');
    const [cityId, setCityId] = React.useState('');
    const [matchStates, setMatchStates] = React.useState([])
    const [matchCities, setMatchCities] = React.useState([])
    const [company, setCompany] = React.useState([]);
    const [email, setEmail] = React.useState('');
    const [mobileno, setMobileno] = React.useState('');
    const [companyid, setCompanyId] = React.useState('');
    const { user } = React.useContext(userContext);
    const history = useHistory();

    const { allCountries, getStates, getCities } = React.useContext(fetchContext)
   
    const setStatefunc = value => {
        setStateId(value)
        setMatchCities(getCities(value))
    }

    const setcountryfunc = (value) => {
        setCountryId(value);
        setMatchStates(getStates(value))
        setStateId('')
        setCityId('')
        setMatchCities([])
    }

    React.useEffect(() => {
        async function getComapny() { 
            const response = await fetch(url + 'fetchCompaniesRoleBranch/', {
                headers: {
                    'Authorization': user.token
                }
            });
            if (response.ok == true) {
                const data = await response.json();
            
            if (data.status == 200) {
                 let company = data.companies_data;
                    setCompany(company);
            }
            else if(data.status == 404) {
               return window.location = window.location.origin + '/#/404'
            }
            else {
                toast.error(data.message)
            }
            }
            
        }
        
         async function FetchBranchData() {
            const response = await fetch(url + '' + id, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 201) {
                    let BranchData = data.BranchData;
                    setBranchName(BranchData.name);
                    setAddress(BranchData.address);
                    countryId(BranchData.countryId);
                    setCityId(BranchData.cityId);
                    setStateId(BranchData.stateId);
                    setCompanyId(BranchData.company_id);
                    mobileno(BranchData.state_id);
                    email(BranchData.email);

                } else if (data.status == 401) {
                    toast.error('Unable to fetch the data please reload the page or try again later')
                }
            }
        }
        getComapny()
        FetchBranchData()
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        if (validator.isMobilePhone(mobileno)) {
            async function submitBranch() {
                const formdata = new FormData();
                formdata.append('name', branchName)
                formdata.append('address', address)
                formdata.append('countryid', countryId)
                formdata.append('stateid', stateId)
                formdata.append('cityid', cityId)
               if (user?.userData.role_id == 1) {
                    formdata.append('companyid', companyid)
                }
                else {
                    formdata.append('companyid', user?.userData.company_id)
                }
                formdata.append('email', email)
                formdata.append('mobile', mobileno)
                const response = await fetch(url + '', {
                    headers: {
                        'Authorization': user.token
                    },
                    body: formdata
                })
                if (response.ok == true) {
                    return history.push('/branchList/')
                }
            }
            submitBranch()
        }
        else {
            toast.error("Invaild Phone Number")
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
                                <label htmlFor="">Branch Name</label>
                                <input required value={branchName} onChange={e => setBranchName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Email</label>
                                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
                            </div>
                        </div>
                      <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Mobile no</label>
                                <input required value={mobileno} onChange={e => setMobileno(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="">Country</label>
                            <select className='form-control' value={countryId} onChange={e => setcountryfunc(e.target.value)} required >
                                <option>Select Country</option>
                                {allCountries?.map(item => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">State</label>
                            <select required className='form-control' value={stateId} onChange={e => setStatefunc(e.target.value)}>
                                <option>Select States</option>
                                {matchStates?.map(item => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">City</label>
                            <select required className='form-control' value={cityId} onChange={e => setCityId(e.target.value)}>
                                <option>Select Cities</option>
                                {matchCities?.map(item => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                    { user?.userData.role_id == 1 && <div className="row">
                        
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
                        </div>}
                   
                      <div className="row">
                        <div className="col-md-12 mt-4">
                            <label htmlFor="">Address</label>
                            <textarea required value={address} onChange={e => setAddress(e.target.value)} className='form-control' cols="137" rows="10"></textarea>
                        </div>
                       </div>

                    <div className="row mt-4 big-btn-div">
                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                </form>
            </div>


        </section>
    )
}
