import React, { lazy } from 'react'
import { userContext } from '../../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import { url } from 'src/helpers/Helpers'
import { Link } from 'react-router-dom'
import Bell from '../../images/bell.svg';
import dashboard from '../../images/dashboard.svg';
import newImg from '../../images/new.svg';
import tickets from '../../images/tickets.svg';
import userImg from '../../images/user.svg';


const Dashboard = () => {

  const { user } = React.useContext(userContext);
  const [openTickes, SetOpenTickes] = React.useState([]);


  React.useEffect(() => {
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
          console.log(data);
        } else if (data.status == 404) {
          return window.location = window.location.origin + '/#/404'
        } else {
          toast.error(data.message)
        }
      }

    }
    GetTicketList()
  }, [])

  return (
    <>
      <ToastContainer />
      <section>

        {/* header menus section */}
        <div className="d-flex justify-content-center mx-auto head_menus">
          <div className="image_box">
            <img src={dashboard} />
          </div>
          <div className="image_box">
            <img src={tickets} />
          </div>
          <div className="image_box">
            <img src={newImg} />
          </div>
          <div className="image_box">
            <img src={Bell} />
          </div>
          <div className="image_box">
            <img src={userImg} />
          </div>
        </div>

        {/* welcome User name */}
        <div className="user_welcome">
          <h1>Welcome back {user?.userData.fname} !</h1>
        </div>

        <div className="container">

          {/* ticket cards */}
          <div className="all_ticket_cards justify-content-between row">
            <div className="col-md-3 py-3 ticket_card">
              <h1>2</h1>
              <h4>open tickets</h4>
            </div>
            <div className="col-md-3 py-3 ticket_card">
              <h1>2</h1>
              <h4>in progress tickets</h4>
            </div>
            <div className="col-md-3 py-3 ticket_card">
              <h1>2</h1>
              <h4>closed tickets</h4>
            </div>
          </div>

          {/* tickets review cards  */}
          <div className="ticket_review_cards row">
            <div className="col-md-6 last_open_ticket_card">
              <div className='row pb-2'>
                <h5 className='col-sm-8'> <i className="fa fa-folder-open"></i> Last Open Tickets</h5>
                <div className='col-sm-4 d-flex justify-content-sm-end view_all_btn'>
                  <a href="#">view all</a>
                </div>
              </div>
              <div className='pt-2'>
                <div className='row '>
                  <p className='col-sm-8'>add test</p>
                  <div className='col-sm-4 d-flex justify-content-sm-end opened_btn'>
                  <a href="">Opened</a>
                  </div>
                </div>
                <div className='row last_open_ticket_card_ticket_id'>
                  <p><i className='fa fa-info-circle'></i>Ticket ID : 50</p>
                  <p><i className='fa fa-clock-o'></i> 51 minutes ago</p>
                  <p><i className='fa fa-archive'></i> Product : Payments</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div>
          <h4> <i class="fa fa-folder-open"></i> Last Open Tickets</h4>
          <ul>
            {openTickes?.map(item => {
              return (
                <li>
                  <Link to={`/ticket/${item.id}/`} >
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
