import Modal from 'components/common/Modal'
import { API_SIGNUP } from 'consts/routes'
import PropTypes from 'prop-types'
import req from 'utils/req'
import React from 'react'
import './style.styl'

export default class ModalSignUp extends React.Component {
  static propTypes = {
    isOpenModalSignUp: PropTypes.bool,
    handleModalSignUp: PropTypes.func
  }
  state = {
    password: '',
    login: ''
  }
  signUp = () => {
    req.post(API_SIGNUP, {login: this.state.login, password: btoa(this.state.password)}, true)
      .then(r => {
        if (r.message === 'User created successfully') {
          this.props.handleModalSignUp()
        }
      })
  }
  render () {
    return (
      <Modal show={this.props.isOpenModalSignUp} onHide={this.props.handleModalSignUp}>
        <div className='modal-signup-header'>
          <h1>Sign Up</h1>
        </div>
        <div className='modal-signup-body'>
          <input type='text' placeholder='Login' value={this.state.login} onChange={e => this.setState({login: e.target.value})} />
          <input type='password' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
          <div className='button-wrap'>
            <button onClick={this.signUp} className='sing-in'>Sign Up</button>
          </div>
        </div>
      </Modal>
    )
  }
}
