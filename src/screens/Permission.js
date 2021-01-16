import React from 'react'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import $ from 'jquery'

export default function Permission() {
    const { user } = React.useContext(userContext);
    const [parentPermission, setParentPermission] = React.useState([]);
    const [finalPermission, setFinalPermission] = React.useState([]);
    const [permissioBasedRole, setPermissioBasedRole] = React.useState([])

    const { id } = useParams();

    const addPermission = (value) => {
        let final_list = {}

        for (let i = 0; i < parentPermission.length; i++) {
            let second_list = [];
            let permission = $(`.${parentPermission[i].Parent_name} > input:checked`);

            if (permission.length > 0) {
                for (let j = 0; j < permission.length; j++) {
                    let item = permission[j];
                    second_list.push($(item).attr('data-type'))
                }
                
                final_list[parentPermission[i].id] = second_list;
            }
        }


        console.log(final_list);

        async function sendPermission() {
            const formData = new FormData();
            formData.append('permission_id', JSON.stringify(final_list));
            formData.append('role_id', id);

            const response = await fetch(url + 'createPermission/', {
                method: 'POST',
                headers: {
                    'Authorization': user.token
                },
                body: formData
            })

            if (response.ok == true) {
                const data = await response.json()
                  if (data.status == 200) {
                    toast.success(data.message);
                } else if (data.status ==404) {
                    return window.location= window.location.origin +'/#/404'
                } else {
                    toast.error(data.message);
                }
            }
        }

        sendPermission()
    }

    React.useEffect(() => {
        async function fetchPermission() {
            const response = await fetch(url + 'RolePermissionPage/' + id, {
                headers: {
                    'Authorization': user.token
                }
            })

            if (response.ok === true) {
                const data = await response.json()
                console.log(data);
                setParentPermission(data.parent_permission_list);
                setPermissioBasedRole(data?.permissioBasedRole)
            }
        }

        fetchPermission();

    }, [id])


    return (
        <section>
            <ToastContainer />
            {parentPermission.map((item, index) => {
                return (
                    <div className="parent_permission">
                        <h3>{item.Parent_name}</h3>
                        <div className='checkbox_div'>
                            <div className={`${item.Parent_name} input-div`}>
                                <input className={`${item.Parent_name}`} data-type='View' type="checkbox" checked={item.Condition.find(item1 => item1 == 'View')} />
                                <label htmlFor="">View</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>

                                <input className={`${item.Parent_name}`} data-type='Add' type="checkbox" checked={item.Condition.find(item1 => item1 == 'Add')} />
                                <label htmlFor="">Add</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>
                                <input className={`${item.Parent_name}`} data-type='Edit' type="checkbox" checked={item.Condition.find(item1 => item1 == 'Edit')} />

                                <label htmlFor="">Edit</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>
                                <input className={`${item.Parent_name}`} data-type='Delete' type="checkbox" checked={item.Condition.find(item1 => item1 == 'Delete')} />

                                <label htmlFor="">Delete</label>
                            </div>
                        </div>
                    </div>
                )
            })}
            <button className='btn btn-primary' onClick={() => addPermission()}>Submit</button>
        </section>
    )
}
