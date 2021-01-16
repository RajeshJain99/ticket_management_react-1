
import React from 'react'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import validator from 'validator'
import { toast, ToastContainer } from 'react-toastify';
import { icons } from 'src/assets/icons';


export default function CreateRole() {
    const history = useHistory();
    const { user } = React.useContext(userContext);
    const [RoleName, setRoleName] = React.useState('');
    const [RoleDescription, setRoleDescription] = React.useState('');
    const [RoleIcon, setRoleIcon] = React.useState('');
    const [roleImage, setRoleImage] = React.useState('');

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setRoleImage(event.target.files[0]);
            setRoleIcon({
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (roleImage) {
            async function sumbitRole() {
                const formData = new FormData();
                formData.append('name', RoleName)
                formData.append('description', RoleDescription)
                formData.append('icon', roleImage)

                const response = await fetch(url + 'create/role', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.token,
                    },
                    body: formData
                })

                if (response.ok == true) {
                    const data = await response.json()
                    if(data.status==200){
                    return history.push('/roleList/')
                    }
                    else if(data.status==404){
                     return  window.location= window.location.origin +'/#/404';
                    } else{
                      toast.error(data.message);
                    }
                }
            }

            sumbitRole()
        }
        else {
            toast.error("Please select image first")
        }
    }
    return (
        <section>
            <ToastContainer />
            <div className="container">
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="">Role Name</label>
                                <input required value={RoleName} onChange={e => setRoleName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="">Role Description</label>
                                <input required value={RoleDescription} onChange={e => setRoleDescription(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Choose Icon</label>
                                <input type="file" onChange={(e) => onImageChange(e)} className="filetype" id="group_image" />
                            </div>
                            {RoleIcon.image && <div>
                                <img id="preview_image" src={RoleIcon.image} />
                            </div>}
                        </div>

                    </div >
                    <div className="row mt-4 big-btn-div">
                        <button type='submit' className='btn btn-success'>Submit</button>
                    </div>

                </form>
            </div>


        </section>
    )
}
