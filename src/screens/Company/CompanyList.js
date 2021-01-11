import React from 'react'
import { url } from 'src/helpers/Helpers';
import { CBadge, CDataTable } from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom';
import CustomModal from '../../components/CustomModal'
import { userContext } from 'src/context/UserContext';

export default function CompanyList() {
    const { user } = React.useContext(userContext);
    const fields = ['#', 'name', 'email', 'Mobile No', 'status', 'actions']
    const [allCompanies, setAllCompanies] = React.useState([]);
    const [modal, setModal] = React.useState(false)
    const [deleteId, setDeleteId] = React.useState('')
    React.useEffect(() => {
        async function getCompanies() {
            const response = await fetch(url + 'getCompanies/')
            if (response.ok === true) {
                const data = await response.json();

                if (data.status == 200) {
                    setAllCompanies(data.companies)
                } else {
                    toast.error(data.message);
                }
            }
        }
        getCompanies()
    }, [])

    const deleteCompany = (id) => {
        setModal(true);
        setDeleteId(id);
    }


    const deleteEntry = () => {
        console.log('ali');
        async function deleteCompany() {
            const response = await fetch(url + 'delete/company/' + deleteId, {
                headers: {
                    'Authorization': user.token
                }
            });

            if (response.ok == true) {
                const data = await response.json()

                if (data.status == 200) {
                    setAllCompanies(data.companies)
                    setModal(false);
                    toast.success('Information deleted successfully')
                }
            }
        }
        deleteCompany();
    }

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success'
            case 'Inactive': return 'secondary'
            default: return 'primary'
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className='add-btn-div'>
                <Link to='/create/company/' className='btn btn-primary'><i class="fa fa-plus mx-1" aria-hidden="true"></i> Add new company</Link>
            </div>
            <CustomModal modal={modal} setModal={setModal} deleteEntry={deleteEntry} />
            <div className='data-table-div'>
                <CDataTable
                    items={allCompanies}
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
                            <Link to={`/edit/company/${item.id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
                            <i onClick={() => deleteCompany(item.id)} class="fa fa-trash-o" aria-hidden="true"></i>
                        </td>
                        )
                    }}
                />
            </div>

        </div>
    )
}
