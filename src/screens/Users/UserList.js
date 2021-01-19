import React from 'react'
import { url } from 'src/helpers/Helpers';
import { CBadge, CDataTable } from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom';
import { userContext } from 'src/context/UserContext';
import CustomModal from '../../components/CustomModal'

export default function UserList() {
    const { user } = React.useContext(userContext);
    const fields = ['#', 'companyName', 'name', 'email', 'role', 'status', 'actions']
    const [allUsers, setallUsers] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState('')

    React.useEffect(() => {
        async function getUsers() {
            const response = await fetch(url + 'userList/', {
                headers: {
                    'Authorization': user.token
                }
            })
            if (response.ok === true) {
                const data = await response.json();

                if (data.status == 200) {
                    setallUsers(data.userData)
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404';
                } else {
                    toast.error(data.message);
                }
            }
        }
        getUsers()
    }, [])

    const deleteUsers = (id) => {
        setModal(true);
        setDeleteId(id);
    }

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success'
            case 'Inactive': return 'secondary'
            default: return 'primary'
        }
    }

    const deleteEntry = () => {

        async function DeleteUsers() {
            const response = await fetch(url + '' + deleteId, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    setallUsers()
                    setModal(false);
                    toast.success('Information deleted successfully')
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                }
            }
        }
        DeleteUsers();
    }
    return (
        <div>
            <ToastContainer />
            <div className='add-btn-div'>
                <Link to='/create/user/' className='btn btn-primary'><i class="fa fa-plus mx-1" aria-hidden="true"></i>Add New User</Link>
            </div>
            <CustomModal modal={modal} setModal={setModal} deleteEntry={deleteEntry} />
            <div className='data-table-div'>
                <CDataTable
                    items={allUsers}
                    fields={fields}
                    itemsPerPage={5}
                    pagination
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    hover
                    sorter
                    scopedSlots={{
                        'status': item => (
                            <td>
                                <CBadge color={getBadge(item.status)}>
                                    {item.status}
                                </CBadge>
                            </td>
                        ),
                        'actions': (item, index) =>
                        (<td className='action-td'>
                            <Link to={`/edit/Users/${item.id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
                            <i onClick={() => deleteUsers(item.id)} class="fa fa-trash-o" aria-hidden="true"></i>
                        </td>
                        ),
                    }}
                />
            </div>

        </div>
    )
}
