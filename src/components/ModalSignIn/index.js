import Modal from 'components/common/Modal'
import { API_SIGNIN } from 'consts/routes'
import cookie from 'react-cookies'
import PropTypes from 'prop-types'
import req from 'utils/req'
import React from 'react'
import './style.styl'

export default class ModalSignIn extends React.Component {
  static propTypes = {
    isOpenModalSignIn: PropTypes.bool,
    handleModalSignIn: PropTypes.func,
    success: PropTypes.func
  }
  state = {
    password: '',
    login: ''
  }
  signIn = () => {
    req.get(API_SIGNIN, {login: this.state.login, password: btoa(this.state.password)})
      .then(r => {
        if (r.message === 'Successfully') {
          cookie.save('auth', r.id)
          this.props.success(r.login, r.id)
          this.props.handleModalSignIn()
        }
      })
  }
  render () {
    return (
      <Modal show={this.props.isOpenModalSignIn} onHide={this.props.handleModalSignIn} success={this.props.success}>
        <div className='modal-signin-header'>
          <h1>Sign In</h1>
        </div>
        <div className='modal-signin-body'>
          <input type='text' placeholder='Login' value={this.state.login} onChange={e => this.setState({login: e.target.value})} />
          <input type='password' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
          <div className='button-wrap'>
            <button onClick={this.signIn} className='sing-in'>Sign In</button>
          </div>
        </div>
      </Modal>
    )
  }
}
