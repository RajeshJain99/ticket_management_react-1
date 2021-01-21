import React from 'react'
import { userContext } from '../../context/UserContext'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { toast, ToastContainer } from 'react-toastify'
import MultiImageInput from 'react-multiple-image-input';
import TimeAgo from 'timeago-react';


export default function Ticket() {

    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };

    const { user } = React.useContext(userContext);
    const { id } = useParams()

    const [images, setImages] = React.useState({});
    const [reply, setReply] = React.useState('');
    const [ownerTicket, setOwnerTicket] = React.useState({});
    const [replyTicket, setReplyTicket] = React.useState([])

    React.useEffect(() => {
        async function GetData() {
            const response = await fetch(url + 'fetchTicketById/' + id + '/', {
                headers: {
                    'Authorization': user.token
                }
            });
            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    setOwnerTicket(data.ticket_detail);
                    setReplyTicket(data.reply_details)
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message)

                }
            }
        }
        GetData()
    }, [id])

    function submitReply() {
        if (reply) {
            Object.size = function (obj) {
                var size = 0,
                    key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };
            let img_blob = [];
            const formData = new FormData()
            formData.append('reply', reply);
            formData.append('ticket_id', id);

            if (Object.size(images) > 0) {
                for (const property in images) {
                    fetch(images[property]).then(res => res.blob()).then(res => img_blob.push({
                        blob: res,
                        name: `1.${res.type.split('/')[1]}`
                    })).then(() => {
                        if (img_blob.length == Object.size(images)) {

                            for (let i = 0; i < img_blob.length; i++) {
                                formData.append('image', img_blob[i].blob, img_blob[i].name)
                            }
                            fetch(url + 'replyTicket/', {
                                method: 'POST',
                                headers: {
                                    'Authorization': user.token
                                },
                                body: formData
                            }).then((res) => {
                                if (res.ok == true) {
                                    res.json().then(res1 => {
                                        const data = res1;
                                        if (data.status == 200) {
                                            return window.location = window.location.origin + '/'
                                        } else if (data.status == 404) {
                                            return window.location = window.location.origin + '/#/404'
                                        } else {
                                            toast.error(data.message)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            } else {
                fetch(url + 'replyTicket/', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.token
                    },
                    body: formData
                }).then((res) => {
                    if (res.ok == true) {
                        res.json().then(res1 => {
                            const data = res1;
                            if (data.status == 200) {
                                return window.location = window.location.origin('/')
                            } else if (data.status == 404) {
                                return window.location = window.location.origin('/#/404')
                            } else {
                                toast.error(data.message)
                            }
                        })
                    }
                })
            }




        } else {
            toast.error('Field Required')
        }
    }

    let parse_Date = Date.parse(ownerTicket?.created_at);
    parse_Date = new Date(parse_Date);

    return (
        <section className='mb-4'>
            <ToastContainer />
            <div className="row w-100 justify-content-around">
                <div className="col-md-8">
                    <div className='ticket-div'>
                        <div className='ticket-own'>
                            <div className="header">
                                <p>Posted at : <TimeAgo datetime={parse_Date} /> </p>
                                <p className="subject"><strong>{ownerTicket.subject}</strong></p>
                                <p className="description">
                                    {ownerTicket.description}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-12 images">
                            <div className="row w-100">
                                {ownerTicket?.images?.map(item => (
                                    <div className='col-md-2'>
                                        <a target='_blank' href={url + `${item.image}`}>
                                            <img className='img-fluid' src={url + `${item.image}`} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ticket-reply">
                            {replyTicket.length > 0 && replyTicket.map(item => (
                                <div className="reply-div  border">
                                    <p>Posted at : <TimeAgo datetime={new Date(Date.parse(item.created_at))} /> </p>
                                    <p className='username'>{item.username}</p>
                                    <p className='description'>{item.description}</p>

                                    <div className="col-md-12 img-div">
                                        <div className="row w-100">
                                            {item.images.map(item1 => (
                                                <div className="col-md-2">
                                                    <a target='_blank' href={url + `${item1}`}>
                                                        <img src={url + `${item1}`} className="img-fluid" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="reply-section">
                        <div className="form-group">
                            <label htmlFor="">Your Reply : *</label>
                            <textarea cols="100" rows="5" className='form-control' value={reply} onChange={e => setReply(e.target.value)}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Attach File (Optional) : </label>
                            <MultiImageInput
                                images={images}
                                setImages={setImages}
                                cropConfig={{ crop, ruleOfThirds: true }}
                            />
                        </div>
                        <button className='w-100 btn btn-success' onClick={() => submitReply()}>Submit</button>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="border info-div">
                        <div className="header">
                            <p>Ticket Information</p>
                            <button className='btn btn-primary'>Close Ticket</button>
                        </div>
                        <div className="info">
                            <div className="detail border">
                                <p>Datetime : {ownerTicket.created_at}</p>
                            </div>
                            <div className="detail border">
                                <TimeAgo datetime={parse_Date} />
                            </div>
                            <div className="detail border">
                                <p>Ticket Status : {ownerTicket.status_id == 1 ? 'Open' : 'Closed'}</p>
                            </div>
                            <div className="detail border">
                                <p>Ticket Priority : <span style={{ background: `${ownerTicket.background}`, color: `${ownerTicket.fontColor}` }}>{ownerTicket.priority_name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

