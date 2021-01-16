import React from 'react'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { ToastContainer, toast } from 'react-toastify'
import { userContext } from '../../context/UserContext'
import { fetchContext } from '../../context/FetchContext'
import { useHistory } from 'react-router-dom'
import validator from 'validator'
import Select from 'react-select'

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


    const { allCountries, allStates, allCities, getStates, getCities } = React.useContext(fetchContext)


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
                    return history.push('/companyList/')

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
                    setAddress(companyData.address);
                    setCountryId({
                        value: companyData.country_id,
                        label: companyData.country_name
                    });
                    setcountryfunc({
                        value: companyData.country_id,
                        label: companyData.country_name
                    })
                    setStateId({
                        value: companyData.state_id,
                        label: companyData.state_name
                    })
                    setStatefunc({
                        value: companyData.state_id,
                        label: companyData.state_name
                    })

                    setCityId({
                        value: companyData.city_id,
                        label: companyData.city_name
                    })

                } else if (data.status == 401) {
                    toast.error('Unable to fetch the data please reload the page or try again later')
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
                            <Select value={countryId} options={allCountries} onChange={setcountryfunc} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">State</label>
                            <Select value={stateId} options={matchStates} onChange={setStatefunc} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">City</label>
                            <Select value={cityId} options={matchCities} onChange={setCityId} />
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
