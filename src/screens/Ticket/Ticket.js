import React from 'react'
import { userContext } from '../../context/UserContext'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { toast, ToastContainer } from 'react-toastify'


export default function Ticket() {

    const { user } = React.useContext(userContext);
    const { id } = useParams()
    React.useEffect(() => {
        async function GetData() {
            const response = await fetch(url + 'fetchTicketById/' + id, {
                headers: {
                    'Authorization': user.token
                }
            });
            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    console.log(data);
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message)

                }
            }
        }
        GetData()
    }, [id])

    return (
        <div>
            <h1>hello</h1>
        </div>
    )
}

