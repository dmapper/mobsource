import ModalSignIn from 'components/ModalSignIn'
import ModalSignUp from 'components/ModalSignUp'
import { prefix } from 'consts/routes'
import cookie from 'react-cookies'
import io from 'socket.io-client'
import React from 'react'
import './style.styl'
const socket = io(prefix)

export default class Home extends React.Component {
  state = {
    isOpenModalSignUp: false,
    isOpenModalSignIn: false,
    disabled: false,
    isAuth: false,
    userName: '',
    online: 0,
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
    const geOnline = () => {
      socket.emit('update', () => 'asdfasdf')
      socket.on('online', online => this.setState({online}))
    }
    geOnline()
    setInterval(() => geOnline(), 1000)
    document.addEventListener('keyup', this.check, false)
    const auth = cookie.load('auth')
    if (auth) {
      this.setState({isAuth: true, userName: auth})
    }
  }
  componentDidUpdate = () => {
    if (this.state.disabled) {
      document.removeEventListener('keyup', this.check, false)
    }
  }
  loguot = () => {
    cookie.remove('auth')
    this.setState({isAuth: false, userName: ''})
  }
  clear = () => {
    this.setState({res: {
      option1: 0,
      option2: 0,
      option3: 0
    }})
  }
  handleModalSignUp = () => this.setState({isOpenModalSignUp: !this.state.isOpenModalSignUp})
  handleModalSignIn = () => this.setState({isOpenModalSignIn: !this.state.isOpenModalSignIn})
  render () {
    return (
      <div id='main'>
        <ModalSignUp isOpenModalSignUp={this.state.isOpenModalSignUp} handleModalSignUp={this.handleModalSignUp} />
        <ModalSignIn isOpenModalSignIn={this.state.isOpenModalSignIn} handleModalSignIn={this.handleModalSignIn}
          success={userName => this.setState({isAuth: true, userName})} />
        <div className='header'>
          {this.state.isAuth
            ? <h1>{this.state.userName}</h1>
            : <button onClick={this.handleModalSignUp} className='sing-up'>Sign Up</button>}
          {this.state.isAuth
            ? <button onClick={this.loguot} className='sing-in'>Logout</button>
            : <button onClick={this.handleModalSignIn} className='sing-in'>Sign In</button>}
        </div>
        <div className='data'>
          {this.state.data.map((item, k) => (
            <div key={k}>
              <h1 className='question'>{item.question}</h1>
              <div>
                {item.answers.map((i, k) => (
                  <div key={k} className='answer'>
                    <input type='radio' name={item.question} value={i.isCorrect} ref={k} disabled={this.state.disabled}
                      onClick={() => this.setState({disabled: true})}
                    />{i.label}<div className='result'>{this.state.res[`option${k + 1}`]}</div><br />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className='online-wrap'>
            <h1>Online:</h1>
            <h1 className='count'>{this.state.online}</h1>
          </div>
        </div>
        {this.state.isAuth && <div className='clear-button-wrap'>
          <button onClick={this.clear}>Clear Results</button>
        </div>}
      </div>
    )
  }
}
