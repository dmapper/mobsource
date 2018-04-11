import Modal from 'components/common/Modal'
import PropTypes from 'prop-types'
import React from 'react'
import './style.styl'

export default class ModalSignIn extends React.Component {
  static propTypes = {
    isOpenModalSignIn: PropTypes.bool,
    handleModalSignIn: PropTypes.func,
    signIn: PropTypes.func
  }
  state = {
    password: '',
    login: ''
  }
  render () {
    return (
      <Modal show={this.props.isOpenModalSignIn} onHide={this.props.handleModalSignIn}>
        <div className='modal-signin-header'>
          <h1>Sign In</h1>
        </div>
        <div className='modal-signin-body'>
          <input type='text' placeholder='Login' value={this.state.login} onChange={e => this.setState({login: e.target.value})} />
          <input type='password' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
          <div className='button-wrap'>
            <button onClick={() => this.props.signIn(this.state.login, this.state.password)} className='sing-in'>Sign In</button>
          </div>
        </div>
      </Modal>
    )
  }
}
