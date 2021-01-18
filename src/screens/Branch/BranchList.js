import { ready } from 'jquery';
import React from 'react'
import { userContext } from 'src/context/UserContext'
import { toast, ToastContainer } from 'react-toastify';
import CustomModal from '../../components/CustomModal';
import { Link } from 'react-router-dom'
import { CDataTable } from '@coreui/react';
import { url } from 'src/helpers/Helpers';

export default function BranchList() {
    const { user } = React.useContext(userContext);
    const fields = ['#', 'name', 'address','companyName', 'email', 'mobile','actions']
    const [allBranches, setallBranches] = React.useState('');
    const [modal, setModal] = React.useState('');
    const [deleteId, setDeleteId] = React.useState('');

     React.useEffect(() => {
        async function GetBranchData() {
            const response = await fetch(url + 'branchList/'
            ,{
                headers : {
                    'Authorization' : user.token
                }
            })
            if (response.ok === true) {
                const data = await response.json();

                if (data.status == 200) {
                    setallBranches(data.branch_data)
                   }
                else if(data.status == 404){
                     return window.location = window.location.origin + '/#/404';
                }
                else {
                    toast.error(data.message);
                }
            }
        }
        GetBranchData()
    }, [])


    const deleteEntry = () => { 
      async function deleteBranch()
      {
       const response= await fetch( url +'deleteBranch/' + deleteId,{
           headers:{
               'Authorization':user.token
           }
       });
       if(response.ok==true){
           const data = await response.json()
           if(data.status==200){
               setModal(false);
               return window.location.reload()
           } else if(data.status ==404){
               return window.location = window.location.origin + '/#/404/'
           } else {
               toast.error(data.message)
           }
        }
      }
        deleteBranch()
    }
  
    const deleteBranch = (id) => {
         setModal(true);
         setDeleteId(id);
     }

    return (
        <div>
            <ToastContainer />
            <div className='add-btn-div'>
                <Link to='/create/branch/' className='btn btn-primary'><i class="fa fa-plus mx-1" aria-hidden="true"></i>Add New Branch</Link>
            </div>
            <CustomModal modal={modal} setModal={setModal} deleteEntry={deleteEntry} />
            <div className='data-table-div' >
                <CDataTable
                    items={allBranches}
                    fields={fields}
                    itemsPerPage={5}
                    pagination
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    hover
                    sorter
                    scopedSlots={{
                        'actions': (items, index) => (
                            <td className='action-td'>
                                <Link to= {`/edit/branch/${items.id}`}><i className='fa fa-pencil' aria-hidden="true"></i></Link>
                                <i onClick={() => deleteBranch(items.id)} className='fa fa-trash-o' aria-aria-hidden="true"></i>
                            </td>
                        )
                    }}
                />
            </div>
        </div>
 )}
