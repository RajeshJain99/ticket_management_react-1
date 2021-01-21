import React, { lazy } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { userContext } from '../../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import MainChartExample from '../charts/MainChartExample.js'
import Toaster from '../notifications/toaster/Toaster'
import { url } from 'src/helpers/Helpers'
import { Link } from 'react-router-dom'
import Loader from 'src/components/Loader'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const Dashboard = () => {

  const { user } = React.useContext(userContext);
  const [openTickes, SetOpenTickes] = React.useState([]);
  const[loading,setLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true);
    async function GetTicketList() {
      const response = await fetch(url + 'fetchLatestTicket/', {
        headers: {
          'Authorization': user.token
        }
      });
      if (response.ok == true) {
        const data = await response.json()
        if (data.status == 200) {
          SetOpenTickes(data.latest_ticket_open)
          setLoading(false);
        } else if (data.status == 404) {
          return window.location = window.location.origin + '/#/404'
        } else {
          toast.error(data.message)
          setLoading(false);
        }
      }

    }
    GetTicketList()
  }, [])

  return (
    <>
    {loading && <Loader/>}
      <ToastContainer />
      <section>
        <div>
          <h4>Last Open Tickets</h4>
          <ul>
            {openTickes?.map(item => {
              return (
                <li>
                  <Link  to={`/ticket/${item.id}/`} >
                    <div>
                      <p>{item.subject}</p>
                      <p>Ticket-id : {item.id} <span>time :- {item.created_at}</span></p>
                      <p>Open</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

    </>
  )
}

export default Dashboard
