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
                console.log(data);

                setAllCountries(data.countriesList.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                }))

                // setAllCountries(data.countriesList);
                setAllStates(data.statesList.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                        country_id: item.country_id
                    }
                }));
                setAllCities(data.citiesList.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                        state_id: item.state_id
                    }
                }));
            }
        }
        fetchNeeds();
    }, [])

    return (
        <fetchContext.Provider value={{ allCountries, allStates, allCities, getStates, getCities }}>
            {props.children}
        </fetchContext.Provider>
    )
}

export { fetchContext, FetchContext }