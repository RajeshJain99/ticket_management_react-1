import React from 'react'
import { useParams } from 'react-router-dom'
import { url } from 'src/helpers/Helpers';
import { userContext } from '../context/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import $ from 'jquery'
import Loader from 'src/components/Loader'

export default function Permission() {
    const { user } = React.useContext(userContext);
    const [parentPermission, setParentPermission] = React.useState([]);
    const [finalPermission, setFinalPermission] = React.useState([]);
    const [permissioBasedRole, setPermissioBasedRole] = React.useState([])
    const [loading,SetLoading] = React.useState(false);

    const { id } = useParams();

    const addPermission = (value) => {
        let final_list = {}


        for (let i = 0; i < parentPermission.length; i++) {
            let second_list = [];
            let third_list = []
            let permission = $(`.${parentPermission[i].Parent_name} > input:checked`);

            if (permission.length > 0) {
                for (let j = 0; j < permission.length; j++) {
                    let item = permission[j];
                    second_list.push($(item).attr('data-type'))
                }

                final_list[parentPermission[i].id] = second_list;
            } else {
                final_list[parentPermission[i].id] = []
            }
        }

        async function sendPermission() {
            SetLoading(true);
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
                    SetLoading(false);
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                } else {
                    toast.error(data.message);
                    SetLoading(false);
                }
            }
        }

        sendPermission()
    }

    React.useEffect(() => {
        SetLoading(true);
        async function fetchPermission() {
            const response = await fetch(url + 'RolePermissionPage/' + id, {
                headers: {
                    'Authorization': user.token
                }
            })

            if (response.ok === true) {
                const data = await response.json()
                 setParentPermission(data.parent_permission_list);
                 setPermissioBasedRole(data?.permissioBasedRole)
                 SetLoading(false);
            }
        }

        fetchPermission();

    }, [id])


    const setCheckbox = () => {

        parentPermission.map(item => {
            const checkebox = $(`.${item.Parent_name} > input`)

            for (let i = 0; i < checkebox.length; i++) {
                const chekBox = checkebox[i]
                const data_type = $(chekBox).attr('data-type');


                if (data_type == 'View') {
                    if (item.View == 'checked') {
                        chekBox.checked = true
                    }
                }
                if (data_type == 'Add') {
                    if (item.Add == 'checked') {
                        chekBox.checked = true

                    }
                }
                if (data_type == 'Edit') {
                    if (item.Edit == 'checked') {
                        chekBox.checked = true

                    }
                }

                if (data_type == 'Delete') {
                    if (item.Delete == 'checked') {
                        chekBox.checked = true

                    }
                }

            }
            return
        })
    }
    setCheckbox();


    console.log('by');
    return (
        <section>
            <ToastContainer />
            {parentPermission.map((item, index) => {
                return (
                    <div className="parent_permission">
                        <h3>{item.Parent_name}</h3>
                        <div className='checkbox_div'>
                            <div className={`${item.Parent_name} input-div`}>
                                <input data-type='View' type="checkbox" />
                                <label htmlFor="">View</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>

                                <input data-type='Add' type="checkbox" />
                                <label htmlFor="">Add</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>
                                <input data-type='Edit' type="checkbox" />

                                <label htmlFor="">Edit</label>
                            </div>
                            <div className={`${item.Parent_name} input-div`}>
                                <input data-type='Delete' type="checkbox" />

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
