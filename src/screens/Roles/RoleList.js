import React from 'react'
import { url } from 'src/helpers/Helpers';
import { CBadge, CDataTable } from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom';
import { userContext } from 'src/context/UserContext';
import CustomModal from '../../components/CustomModal'
import loader from 'src/components/Loader'
import Loader from 'react-spinners/BarLoader';

export default function RoleList() {
    const { user } = React.useContext(userContext);
    const fields = ['#', 'name', 'Icon', 'actions']
    const [allRoles, setAllRoles] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState('')
    const [loading,setLoading] = React.useState(false);

    React.useEffect(() => {
        async function getRoles() {
            setLoading(true);
            const response = await fetch(url + 'roles/', {
                headers: {
                    'Authorization': user.token
                }
            })
            if (response.ok === true) {
                const data = await response.json();

                if (data.status == 200) {
                    setAllRoles(data.role_list)
                    setLoading(false);
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404'
                }
                else {
                    toast.error(data.message);
                    setLoading(false);
                }
            }
        }
        getRoles()
    }, [])

    const deleteRole = (id) => {
        setModal(true);
        setDeleteId(id);
    }

    const deleteEntry = () => {
        async function DeleteRole() {

            setLoading(true);
            const response = await fetch(url + 'delete/role/' + deleteId, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    setAllRoles(data.role_list)
                    setModal(false);
                    setLoading(false)
                    toast.success('Information deleted successfully')
                } else if (data.status == 404) {
                    return window.location = window.location.origin + '/#/404';
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }

            }
        }
        DeleteRole();
    }
    return (
        <div>
            {loading && <Loader/>}
            <ToastContainer />
            <div className='add-btn-div'>
                <Link to='/create/role/' className='btn btn-primary'><i class="fa fa-plus mx-1" aria-hidden="true"></i> Add new Role</Link>
            </div>
            <CustomModal modal={modal} setModal={setModal} deleteEntry={deleteEntry} />
            <div className='data-table-div'>
                <CDataTable
                    items={allRoles}
                    fields={fields}
                    itemsPerPage={5}
                    pagination
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    hover
                    sorter
                    scopedSlots={{
                        'actions': (item, index) =>
                        (<td className='action-td'>
                            {user?.userData.Roles?.Edit == 1 && <Link to={`/edit/role/${item.id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>}

                            {user?.userData.Roles?.Delete == 1 && <i onClick={() => deleteRole(item.id)} class="fa fa-trash-o" aria-hidden="true"></i>}

                            {user?.userData.Permission?.View == 1 && <Link to={`/permissionPage/${item.id}`}><i class="fa fa-lock" aria-hidden="true"></i></Link>}
                        </td>
                        ),
                        'Icon': (item) => (
                            <td className="td_image">
                                <img id="DisplayImage" src={`${url}${item.icon}`} alt="" />
                            </td>
                        )
                    }}
                />
            </div>

        </div>
    )
}
