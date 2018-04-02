import Modal from 'components/Modal/Modal.jsx'
import cookie from 'react-cookies'
import React from 'react'
import './Main.styl'
const admin = {
  name: 'Admin',
  login: 'admin',
  password: 'admin'
}

export default class Home extends React.Component {
  state = {
    isOpenModalSignIn: false,
    disabled: false,
    isAuth: false,
    userName: '',
    password: '',
    login: '',
    data: [
      {
        question: 'Please select a choice only if you are confident of your response',
        answers: [
          {
            label: 'option 1',
            isCorrect: true
          },
          {
            label: 'option 2'
          },
          {
            label: 'option 3'
          }
        ]
      }
    ],
    res: {
      option1: 20,
      option2: 30,
      option3: 50
    }
  }
  check = e => {
    if (e.key < 4 && e.key > 0) {
      this.setState({disabled: true}, () => {
        this.refs[e.key].checked = true
      })
    }
  }
  componentWillMount = () => {
    document.addEventListener('keyup', this.check, false)
    if (cookie.load('auth')) {
      this.setState({isAuth: true, userName: admin.name})
    }
  }
  componentDidUpdate = () => {
    if (this.state.disabled) {
      document.removeEventListener('keyup', this.check, false)
    }
  }
  handleModalSignIn = () => this.setState({isOpenModalSignIn: !this.state.isOpenModalSignIn})
  signIn = () => {
    if (this.state.login === admin.login && this.state.password === admin.password) {
      cookie.save('auth', true)
      this.setState({isAuth: true, userName: admin.name}, () => this.handleModalSignIn())
    }
  }
  loguot = () => {
    cookie.remove('auth')
    this.setState({isAuth: false, userName: ''})
  }
  clear = () => {

  }
  render () {
    return (
      <div id='main'>
        <Modal show={this.state.isOpenModalSignIn} onHide={this.handleModalSignIn}>
          <div className='modal-header'>
            <h1>Sign In</h1>
          </div>
          <div className='modal-body'>
            <input type='text' placeholder='Login' value={this.state.login} onChange={e => this.setState({login: e.target.value})} />
            <input type='password' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
            <div className='button-wrap'>
              <button onClick={this.signIn} className='sing-in'>Sign In</button>
            </div>
          </div>
        </Modal>
        <div className='header'>
          <h1>{this.state.userName}</h1>
          {this.state.isAuth
            ? <button onClick={this.loguot} className='sing-in'>Logout</button>
            : <button onClick={this.handleModalSignIn} className='sing-in'>Sign In</button>}
        </div>
        <div className='data'>
          {this.state.data.map((item, k) => {
            return (
              <div key={k}>
                <h1 className='question'>{item.question}</h1>
                <div>
                  {item.answers.map((i, k) => {
                    return (
                      <div key={k} className='answer'>
                        <input type='radio' name={item.question} value={i.isCorrect} ref={k} disabled={this.state.disabled}
                          onClick={() => this.setState({disabled: true})}
                        />{i.label}<div className='result'>{this.state.res[`option${k + 1}`]}</div><br />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div className='online-wrap'>
            <h1>Online:</h1>
            <h1 className='count'>10</h1>
          </div>
        </div>
        {this.state.isAuth && <div className='clear-button-wrap'>
          <button onClick={this.clear}>Clear Results</button>
        </div>}
      </div>
    )
  }
}
