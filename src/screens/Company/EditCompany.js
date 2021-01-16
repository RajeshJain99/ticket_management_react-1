import React from 'react'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { ToastContainer, toast } from 'react-toastify'
import { userContext } from '../../context/UserContext'
import { fetchContext } from '../../context/FetchContext'
import { useHistory } from 'react-router-dom'
import validator from 'validator'

export default function EditCompany() {
    const history = useHistory();
    const { id } = useParams();
    const { user } = React.useContext(userContext);
    const [companyData, setCompanyData] = React.useState('');
    const [companyName, setCompanyName] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [countryId, setCountryId] = React.useState('');
    const [stateId, setStateId] = React.useState('');
    const [cityId, setCityId] = React.useState('');
    const [matchStates, setMatchStates] = React.useState([])
    const [matchCities, setMatchCities] = React.useState([])
    const [address, setAddress] = React.useState('')


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

    const handleSubmit = e => {
        e.preventDefault();
        if (validator.isMobilePhone(mobile)) {
            async function submitCompany() {
                const formData = new FormData();
                formData.append('name', companyName)
                formData.append('mobile', mobile)
                formData.append('email', email)
                formData.append('country_id', countryId)
                formData.append('state_id', stateId)
                formData.append('city_id', cityId)
                formData.append('address', address)
                formData.append('company_id', id)

                const response = await fetch(url + 'update/company', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.token,
                    },
                    body: formData
                })

                if (response.ok == true) {
                    const data = await response.json()
                    if(data.status==200){
                    return history.push('/companyList/')
                    }
                     else if(data.status==404){
                      return  window.location=window.location.origin +'/#/404';
                    } else {
                      toast.error(data.message);
                  }  
                }
            }
            submitCompany()
        } else {
            toast.error('Invalid mobile number');
        }

    }

    React.useEffect(() => {
        async function fetchCompanyData() {
            const response = await fetch(url + 'edit/company/' + id, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 201) {
                    let companyData = data.company_data;
                    setCompanyData(companyData);
                    setCompanyName(companyData.name);
                    setEmail(companyData.email);
                    setMobile(companyData.mobile);
                    setCountryId(companyData.country_id);
                    setcountryfunc(companyData.country_id);
                    setStateId(companyData.state_id);
                    setStatefunc(companyData.state_id);
                    setCityId(companyData.city_id);
                    setAddress(companyData.address);
                } else if (data.status == 401) {
                    toast.error('Unable to fetch the data please reload the page or try again later')
                }
                 else if(data.status == 404){
                     return window.location = window.location.origin + '/#/404';
                }
            }
        }

        fetchCompanyData()
    }, [id])
    return (
        <section>
            <ToastContainer />
            <div className="container">
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Company Name</label>
                                <input required value={companyName} onChange={e => setCompanyName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Mobile No.</label>
                                <input required value={mobile} onChange={e => setMobile(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Email</label>
                                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="">Country</label>
                            <select required className='form-control' value={countryId} onChange={e => setcountryfunc(e.target.value)} >
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
