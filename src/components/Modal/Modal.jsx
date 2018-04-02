import PropTypes from 'prop-types'
import React from 'react'
import './Modal.styl'

export default class Modal extends React.Component {
  constructor () {
    super()
    this.state = {
      animation: false,
      flag: false
    }
  }
  init = () => {
    if (this.props.show && !this.state.animation) {
      setTimeout(() => this.setState({animation: true, flag: true}), 1)
    } else if (!this.props.show && this.state.animation) {
      setTimeout(() => this.setState({animation: false}), 1)
      setTimeout(() => this.setState({flag: false}), 200)
    }
  }
  componentDidUpdate = () => this.init()
  componentDidMount = () => this.init()
  render () {
    return (
      <div>
        <div id={this.props.show ? 'modal-background' : this.state.flag ? 'modal-background' : 'hidden'}
          className={this.state.animation ? 'fade-background' : ''} />
        <div id={this.props.show ? 'modal-wrapper' : this.state.flag ? 'modal-wrapper' : 'hidden'} onClick={this.props.onHide}>
          <div id='modal-content' className={this.state.animation ? 'fade-content' : ''} onClick={e => e.stopPropagation()}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
Modal.propTypes = {
  children: PropTypes.any,
  onHide: PropTypes.func,
  show: PropTypes.bool
}
Modal.defaultProps = {
  onHide: () => {},
  children: '',
  show: false
}
