import { object } from 'prop-types';
import React from 'react'
import MultiImageInput from 'react-multiple-image-input';
import { toast, ToastContainer } from 'react-toastify';
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import Select from 'react-select'

export default function CreateTicket() {

    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };

    const [images, setImages] = React.useState({});
    const [subject, setSubject] = React.useState('')
    const [priority, setpriority] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [allPriorites, setallPriorites] = React.useState([])
    const [assign, setAssign] = React.useState([])
    const [allassign, setallAssign] = React.useState('')
    const { user } = React.useContext(userContext);


    React.useEffect(() => {
        async function GetDropDownData() {
            const response = await fetch(url + 'priorities/', {
                headers: {
                    'Authorization': user.token
                }
            });
            if (response.ok == true) {
                const data = await response.json()
                console.log(data);
                if (data.status == 200) {
                    setallPriorites(data.priorities_data)
                    setallAssign([{ value: 0, label: 'All' }, ...data.user_data])
                    setAssign([{
                        value: 0,
                        label: 'All'
                    }])
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message);
                }
            }
        }
        GetDropDownData()
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (priority != 0 && assign) {
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
            formData.append('subject', subject)
            formData.append('priority', priority)
            formData.append('assign', JSON.stringify(assign))
            formData.append('description', description)


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
                            fetch(url + 'createTicket/', {
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
                fetch(url + 'createTicket/', {
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
            toast.error('Select value in all dropdowns')
        }
    }

    return (
        <section>
            <ToastContainer />
            <div className='container' >
                <form onSubmit={e => handleSubmit(e)}>
                    <div className='row'>
                        <div className='col-md-5'>
                            <div className='form-group' >
                                <label htmlFor=''>Subject</label>
                                <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} className='form-control' placeholder='Subject' />
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <div className='form-group'>
                                <label>Select the Priority</label>
                                <select id="lang" onChange={e => setpriority(e.target.value)} value={priority} className='form-control' placeholder='Select P'>
                                    <option value={0}>Select Priority</option>
                                    {allPriorites?.map((items) => (
                                        <option value={items.id}>{items.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <div className='form-group'>
                                <label>Assign Users</label>
                                <Select isMulti options={allassign} value={assign} onChange={setAssign} />
                            </div>
                        </div>
                    </div>
                    <div className='row' >
                        <div className='col-md-12 mt-4'>
                            <label htmlFor=''>Description</label>
                            <textarea type='text' required value={description} onChange={e => setDescription(e.target.value)} className='form-control' placeholder='Description' cols="137" rows="10" ></textarea>
                        </div>
                    </div>
                    <br />
                    <div className='row'>
                        <div className='form-group'>
                            <label htmlFor=''>Attach file(optional)</label>
                            <MultiImageInput
                                images={images}
                                setImages={setImages}
                                cropConfig={{ crop, ruleOfThirds: true }}
                            />
                        </div>
                    </div>
                    <div className="row mt-4 big-btn-div">
                        <button className='btn btn-success' type='submit'>Submit</button>
                    </div>

                </form>
            </div>
        </section>
    )


}
