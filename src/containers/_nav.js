import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Company',
    to: '/companyList',
    icon: 'cil-puzzle',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Roles',
    to: '/roleList',
    icon: 'cil-user-follow',
  },
  {
   _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/userList',
    icon: 'cil-user',
  },
  {
    _tag: 'CSidebarNavItem',
    name:'Branch',
    to:'/branchList',
    icon : 'cil-puzzle'
  }

  
]

export default _nav

// const { user } = React.useContext(userContext);