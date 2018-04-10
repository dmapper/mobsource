import { API_VOTE, prefix, API_GET_USER } from 'consts/routes'
import ModalSignIn from 'components/ModalSignIn'
import ModalSignUp from 'components/ModalSignUp'
import cookie from 'react-cookies'
import io from 'socket.io-client'
import req from 'utils/req'
import React from 'react'
import './style.styl'
let socket = io(prefix)

const admin = 'admin'
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
            value: 1
          },
          {
            label: 'option 2',
            value: 2
          },
          {
            label: 'option 3',
            value: 3
          }
        ]
      }
    ],
    res: {
      option1: 0,
      option2: 0,
      option3: 0
    }

  }
  vote = e => {
    req.post(API_VOTE, {option: e, user_id: this.state.id}, true)
      .then(r => {
        if (r.message === 'User voted successfully') {
          console.log(r.result)
          this.setState({res: {
            option1: r.result.o1,
            option2: r.result.o2,
            option3: r.result.o3
          },
          disabled: true}, () => { this.refs[e - 1].checked = true })
        } else if (r.message === 'User already voted') {
          this.setState({disabled: true}, () => { this.refs[e - 1].checked = true })
        }
      })
  }
  check = e => {
    console.log('check')
    if (e.key < 4 && e.key > 0) {
      this.vote(e.key)
    }
  }
  componentWillMount = () => {
    const geData = () => {
      socket.emit('update', () => { })
      socket.on('data', obj => {
        this.setState({
          online: obj.online,
          res: {
            option1: obj.res.o1,
            option2: obj.res.o2,
            option3: obj.res.o3
          }})
        // console.log(obj.res)
      }
      )
    }
    geData()
    setInterval(() => geData(), 3000)
    document.addEventListener('keyup', this.check, false)
    const auth = cookie.load('auth')
    if (auth) {
      req.get(API_GET_USER.replace('{id}', auth))
        .then(r => {
          if (r.message === 'Successfully') {
            this.setState({isAuth: true, userName: r.login, id: auth})
          }
        })
    }
  }
  componentDidUpdate = () => {
    if (this.state.disabled) {
      document.removeEventListener('keyup', this.check, false)
    }
  }
  loguot = () => {
    cookie.remove('auth')
    this.setState({disabled: false, isAuth: false, userName: ''})
  }
  clear = () => {
    req.delete(API_VOTE).then(r => {
      if (r.message === 'Voting results are deleted') {
        this.setState({
          disabled: false,
          res: {
            option1: 0,
            option2: 0,
            option3: 0
          }})
        console.log('succes')
      }
    })
  }
  handleModalSignUp = () => this.setState({isOpenModalSignUp: !this.state.isOpenModalSignUp})
  handleModalSignIn = () => this.setState({isOpenModalSignIn: !this.state.isOpenModalSignIn})
  render () {
    return (
      <div id='main'>
        <ModalSignUp isOpenModalSignUp={this.state.isOpenModalSignUp} handleModalSignUp={this.handleModalSignUp} />
        <ModalSignIn isOpenModalSignIn={this.state.isOpenModalSignIn} handleModalSignIn={this.handleModalSignIn}
          success={(userName, id) => this.setState({isAuth: true, userName, id})} />
        <div className='header'>
          {this.state.isAuth
            ? <h1>{this.state.userName}</h1>
            : <button onClick={this.handleModalSignUp} className='sing-up'>Sign Up</button>}
          {this.state.isAuth
            ? <button onClick={this.loguot} className='sing-in'>Logout</button>
            : <button onClick={this.handleModalSignIn} className='sing-in'>Sign In</button>}
        </div>
        {this.state.isAuth && <div className='data'>
          {this.state.data.map((item, k) => (
            <div key={k}>
              <h1 className='question'>{item.question}</h1>
              <div>
                {item.answers.map((i, k) => (
                  <div key={k} className='answer'>
                    <input type='radio' name={item.question} value={i.isCorrect} ref={k} disabled={this.state.disabled}
                      onClick={() => this.vote(k + 1)}
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
        </div>}
        {this.state.userName === admin && <div className='clear-button-wrap'>
          <button onClick={this.clear}>Clear Results</button>
        </div>}
      </div>
    )
  }
}
