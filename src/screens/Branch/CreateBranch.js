import { ready } from 'jquery';
import React from 'react'
import { userContext } from '../../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import { fetchContext } from '../../context/FetchContext'
import { useHistory } from 'react-router-dom';
import { url } from 'src/helpers/Helpers';
import validator from 'validator'



export default function CreateBranch() {

    const [branchName, setBranchName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [countryId, setCountryId] = React.useState('');
    const [stateId, setStateId] = React.useState('');
    const [cityId, setCityId] = React.useState('');
    const [matchStates, setMatchStates] = React.useState([])
    const [matchCities, setMatchCities] = React.useState([])
    const [company, setCompany] = React.useState([]);
    const [companyid, setCompanyId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobileno, setMobileno] = React.useState('');
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
    
        async function getCompanyDropDown() {
            const response = await fetch(url + 'fetchCompaniesRoleBranch/', {
                headers: {
                    'Authorization': user.token
                }
            }); 
           
            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    let company = data.companies_data;
                    setCompany(company);
                }
                 else if (data.status ==404){
                    return window.location = window.location.origin + '/#/404'
                }
                else {
                toast.error(data.message)
            }
            }
        }
        getCompanyDropDown()
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        if (validator.isMobilePhone(mobileno)) {
            async function submitBranch() {
                const formdata = new FormData();
                formdata.append('name', branchName)
                formdata.append('address', address)
                formdata.append('country_id', countryId)
                formdata.append('state_id', stateId)
                formdata.append('city_id', cityId)
                if (user?.userData.role_id==1) {
                    formdata.append('company_id', user?.userData.company_id)
                }
                else{
                    formdata.append('company_id', companyid)
                }
                formdata.append('email', email)
                formdata.append('mobile', mobileno)

                const response = await fetch(url + 'createBranch/', {
                    method:'POST',
                    headers: {
                        'Authorization': user.token
                    },
                    body: formdata
                })
                if (response.ok == true) {
                    const data = await response.json()
                    
                    if(data.status==200){
                      return history.push('/branchList/')
                    } else if (data.status==404) {
                        return window.location = window.location.origin + '/#/404';
                    } else {
                        toast.error(data.message);
                    }

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
