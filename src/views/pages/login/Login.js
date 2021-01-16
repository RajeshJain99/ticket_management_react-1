import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import $ from 'jquery'
import { userContext } from '../../../context/UserContext'
import { url } from 'src/helpers/Helpers'


const Login = () => {
  const { user, setUser } = React.useContext(userContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    
    e.preventDefault();
   const formData = new FormData()
    formData.append('email', email);
    formData.append('password', password);
    
    $('#ButtonSumbit').attr('disabled',true)
     async function login() {
      try {
        const response = await fetch(url + 'login/', {
          method: 'POST',
          body: formData
        })

        if (response.ok == true) {
          const data = await response.json()

          if (data.status == 200) {
            setUser({
              token: data.token,
              userData: data.userData
             
            })
            if (data.userData.is_first_login == 0) {
              return window.location = window.location.origin + '/#/register';
            }
            else {
              return window.location = window.location.origin + '/';
            }
          }
          else {
            toast.error(data.message);
             $('#ButtonSumbit').attr('disabled',false)
          }
        }
      } catch (err) {
        toast.warn('Oops something went wrong!')
        console.log(err);
      }
    }

    login();
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={e => handleSubmit(e)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" required placeholder="Email Address" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton id="ButtonSumbit"  type='submit' color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                    <Link to="/register">
                      <CButton  color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
