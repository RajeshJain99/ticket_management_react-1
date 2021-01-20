import React, { useState } from 'react'
import {
    CCol,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTabPane,
    CCard,
    CCardBody,
    CTabs,
    CCardHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'



export default function AllTickes() {
    const [active, setActive] = useState(1)
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.'
    return (
        <CCol xs="12" md="12" className="mb-4">
            <CCard>
                <CCardHeader>
                    Index indentifiers
                <DocsLink name="CTabs" />
                </CCardHeader>
                <CCardBody>
                    <CTabs>
                        <CNav variant="tabs">
                            <CNavItem>
                                <CNavLink>
                                    All Ticktes
                            </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Open Ticktes
                            </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Closed Ticktes
                            </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane>
                                {`1. ${lorem}`}
                            </CTabPane>
                            <CTabPane>
                                {`2. ${lorem}`}
                            </CTabPane>
                            <CTabPane>
                                {`3. ${lorem}`}
                            </CTabPane>
                        </CTabContent>
                    </CTabs>
                </CCardBody>
            </CCard>
        </CCol>
    )
}


