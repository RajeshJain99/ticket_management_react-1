import React from 'react'
import { url } from 'src/helpers/Helpers'

const fetchContext = React.createContext()

function FetchContext(props) {
    const [allCountries, setAllCountries] = React.useState([])
    const [allStates, setAllStates] = React.useState([])
    const [allCities, setAllCities] = React.useState([])
    // const [matchStates, setMatchStates] = React.useState([])
    // const [matchCities, setMatchCities] = React.useState([])

    const getStates = (id) => {
        return allStates.filter(item => item.country_id == id)
    }

    const getCities = id => {
        return allCities.filter(item => item.state_id == id)
    }

    React.useEffect(() => {
        async function fetchNeeds() {
            const response = await fetch(url + 'fetchNeeds/')

            if (response.ok === true) {
                const data = await response.json();

                setAllCountries(data.countriesList);
                setAllStates(data.statesList);
                setAllCities(data.citiesList);
            }
        }
        fetchNeeds();
    }, [])


    return (
        <fetchContext.Provider value={{ allCountries, getStates, getCities }}>
            {props.children}
        </fetchContext.Provider>
    )
}

export { fetchContext, FetchContext }