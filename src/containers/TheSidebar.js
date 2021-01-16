import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { userContext } from 'src/context/UserContext';
// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
   const { user } = React.useContext(userContext);
 
   const try_navigation = [];

   const NewNavigation = navigation.map((item, index)=>
   {
     if(item.name == "Company"){
       if(user?.userData.Company.View ==1) {
         try_navigation.push(item)
       }
      }
      if(item.name == "Roles"){
       if(user?.userData.Roles.View ==1) {
         try_navigation.push(item)
       }
      }
      if(item.name == "Users"){
       if(user?.userData.User.View ==1) {
         try_navigation.push(item)
       }
      }
      if(item.name == "Branch"){
       if(user?.userData.Branch.View ==1) {
         try_navigation.push(item)
       }
      }
   })

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={try_navigation}
         
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
