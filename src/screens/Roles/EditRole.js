import React from 'react'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { ToastContainer, toast } from 'react-toastify'
import { userContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import validator from 'validator'
import { cilObjectGroup } from '@coreui/icons';
import Loader from 'src/components/Loader'

export default function EditRole() {
    const history = useHistory();
    const { id } = useParams();
    const { user } = React.useContext(userContext);
    const [roleName, setRoleName] = React.useState('');
    const [roleDescription, setRoleDescription] = React.useState('');
    const [roleIcon, setRoleIcon] = React.useState('');  // ---> display
    const [roleImage, setRoleImage] = React.useState(null); // ---> roleImage
    const [loading,setLoding]= React.useState(false);


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setRoleImage(event.target.files[0]);
            setRoleIcon(URL.createObjectURL(event.target.files[0]));
        }
    }
    const handleSubmit = e => {
        e.preventDefault();
        async function submitRole() {
            setLoding(true);
            const formData = new FormData();
            console.log(roleImage);
            console.log(roleIcon);
            formData.append('role_id', id)
            formData.append('name', roleName)
            formData.append('description', roleDescription)
            if (roleImage !=
                null) {
                console.log('not null');
                formData.append('icon', roleImage)
                console.log(roleImage);
            } else {
                console.log('null');
                formData.append('icon', null)
            }


            const response = await fetch(url + 'edit/role/', {
                method: 'POST',
                headers: {
                    'Authorization': user.token,
                },
                body: formData
            })

            if (response.ok == true) {
                const data = await response.json()
                if (data.status == 200) {
                    return history.push('/roleList/')
                }
                else if(data.status==404){
                  return window.location= window.location.origin +'/#/404';
                }
                else {
                    toast.error(data.message);
                    setLoding(false);
                }

            }
        }
        submitRole()
    }

    React.useEffect(() => {
        async function fetchRoleData() {
            setLoding(true);
            const response = await fetch(url + 'role/detail/' + id, {

                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    let roleData = data.roleDetail;
                    console.log(roleData)
                    setRoleName(roleData?.name);
                    setRoleDescription(roleData?.description);
                    setRoleImage(roleData?.icon)
                    setRoleIcon(`${url}${roleData?.icon}`) //---> only preview
                    setLoding(false);
                }
                else if(data.status==404){
                return window.location= window.location.origin + '/#/404';
                }
                else {
                    toast.error(data.message)
                    setLoding(false);
                }
            }
        }
        fetchRoleData()
    }, [id])

    return (
        <section>
            {loading && <Loader/>}
            <ToastContainer />
            <div className="container">
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="">Role Name</label>
                                <input required value={roleName} onChange={e => setRoleName(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="">Role Description</label>
                                <input required value={roleDescription} onChange={e => setRoleDescription(e.target.value)} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Choose Icon</label>
                                <input type="file" onChange={(e) => onImageChange(e)} className="filetype" id="group_image" />
                            </div>
                            <div>
                                {roleIcon && <div>
                                    <img id="preview_image" src={`${roleIcon}`} />
                                </div>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mt-4 big-btn-div">
                        <button type='submit' className='btn btn-success'>Submit</button>
                    </div>
                </form>
            </div>
        </section>
    )

}
