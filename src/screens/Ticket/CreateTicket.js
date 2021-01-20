import React from 'react'



export default function CreateTicket() {

    const [subject, setSubject] = React.useState('')
    const [priority, setpriority] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [image, setImage] = React.useState('')
    const [displayImage,SetDisplayImage] = React.useState('')
    const [allPriorites, setallPriorites] = React.useState([])

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            SetDisplayImage({
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    }
    return (
        <section>
            <div className='container' >
                <form>
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
                                    {allPriorites?.map((items) => (
                                        <option value={items.id}>{items.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row' >
                        <div className='col-md-12 mt-4'>
                            <label htmlFor=''>Description</label>
                            <textarea type='text' required value={description} onChange={e => setDescription(e.target.value)} className='form-control' placeholder='Description' cols="137" rows="10" ></textarea>
                        </div>
                    </div>
                    <br/>
                    <div className='row'>
                      
                            <div className='form-group'>
                                <label htmlFor=''>Attach file(optional)</label>
                                <input type='file' value={image} onChange={(e) => onImageChange(e)} className='form-control' />
                            </div>
                      </div>
                </form>
            </div>
        </section>
    )
}


