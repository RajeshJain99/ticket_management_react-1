
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { fetchContext } from '../../context/FetchContext'
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import validator from 'validator'
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';


export default function CreateCompany() {
    const history = useHistory();
    const { user } = React.useContext(userContext);
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
        setMatchCities(getCities(value.value))
    }

    const setcountryfunc = (value) => {
        setCountryId(value);
        setMatchStates(getStates(value.value))
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
                formData.append('country_id', countryId.value)
                formData.append('state_id', stateId.value)
                formData.append('city_id', cityId.value)
                formData.append('address', address)

                const response = await fetch(url + 'create/company', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.token,
                    },
                    body: formData
                })

                if (response.ok == true) {
                    return history.push('/companyList/')

                }
            }
            submitCompany()
        } else {
            toast.error('Invalid mobile number');
        }

    }

    const changeCity = value => {
        setCityId(value);
    }


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
                            <Select
                                options={allCountries}
                                value={countryId}
                                onChange={setcountryfunc}

                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">State</label>
                            <Select options={matchStates} value={stateId} onChange={setStatefunc} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">City</label>
                            <Select options={matchCities} value={cityId} onChange={changeCity} />
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
