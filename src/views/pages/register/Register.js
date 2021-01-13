import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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
import { toast, ToastContainer } from 'react-toastify';
import { url } from 'src/helpers/Helpers';
import { userContext } from '../../../context/UserContext'


const Register = () => {
  const [password, setPassword] = React.useState('');
  const [ConfirmPassword, setConfirmPassword] = React.useState('');
  const { user } = React.useContext(userContext);

  const handleSubmit = e => {
    e.preventDefault();

    if (password != null && ConfirmPassword != null) {
      if (password == ConfirmPassword) {
        async function submitPassword() {
          const formData = new FormData();
          formData.append('password', password)

          const response = await fetch(url + 'updatePassword/', {
            method: 'POST',
            headers: {
              'Authorization': user.token,
            },
            body: formData
          })

          if (response.ok == true) {
            const data = await response.json()
            if (data.status == 200) {
              return window.location = window.location.origin + '/';
            } else {
              toast.error(data.message)
            }
          }

        }
        submitPassword()

      }
      else {
        toast.error("Password Does Not match")
      }
    }
  }


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={e => handleSubmit(e)}>
                  <h1>Reset Password</h1>
                  <p className="text-muted">Reset your password</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" type="password" />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" required value={ConfirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Reset password" autoComplete="new-password" />
                  </CInputGroup>
                  <CButton type='submit' color="success" block>Reset Password</CButton>
                </CForm>
              </CCardBody>
              <CCardFooter className="p-4">
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
