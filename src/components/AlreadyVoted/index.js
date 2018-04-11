import Modal from 'components/common/Modal'
import PropTypes from 'prop-types'
import React from 'react'
import './style.styl'

export default class ModalSignIn extends React.Component {
  static propTypes = {
    isOpenModalAlreadyVoted: PropTypes.bool,
    handleModalAlreadyVoted: PropTypes.func
  }
  render () {
    return (
      <Modal show={this.props.isOpenModalAlreadyVoted} onHide={this.props.handleModalAlreadyVoted}>
        <div className='modal-alreade-voted-body'>
          <h1 className='title'>User already voted</h1>
          <div className='button-wrap'>
            <button onClick={() => this.props.handleModalAlreadyVoted()} className='sing-in'>Close</button>
          </div>
        </div>
      </Modal>
    )
  }
}
