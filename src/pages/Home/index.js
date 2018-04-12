import { API_VOTE, prefix } from 'consts/routes'
import ModalSignIn from 'components/ModalSignIn'
import cookie from 'react-cookies'
import io from 'socket.io-client'
import uniqid from 'uniqid'
import req from 'utils/req'
import React from 'react'
import './style.styl'
let socket = io(prefix)

export default class Home extends React.Component {
  state = {
    isOpenModalSignIn: false,
    userName: '',
    online: 0,
    active: 0,
    data: [
      {
        question: 'Please select a choice only if you are confident of your response (You can choose by entering 1, 2, 3 on your keyboard) The admin will reset results after every question',
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
    sum: 0,
    res: {
      option1: 0,
      option2: 0,
      option3: 0
    }
  }
  vote = e => {
    req.post(API_VOTE, {option: e, user_id: cookie.load('auth')}, true)
      .then(r => {
        if (r.message === 'User voted successfully') {
          let a = 0
          if (r.result.o1 > a) a = 1
          if (r.result.o2 > a) a = 2
          if (r.result.o3 > a) a = 3
          this.setState({
            active: a,
            sum: r.result.o1 + r.result.o2 + r.result.o3,
            res: {
              option1: r.result.o1,
              option2: r.result.o2,
              option3: r.result.o3
            }}, () => { this.refs[`option${e}`].checked = true })
        }
      })
  }
  componentWillMount = () => {
    const geData = () => {
      socket.emit('update', () => { })
      socket.on('data', obj => {
        let a = 0
        if (obj.result.o1 > a) a = 1
        if (obj.result.o2 > a) a = 2
        if (obj.result.o3 > a) a = 3
        this.setState({
          active: a,
          online: obj.online,
          sum: obj.result.o1 + obj.result.o2 + obj.result.o3,
          res: {
            option1: obj.result.o1,
            option2: obj.result.o2,
            option3: obj.result.o3
          }})
      }
      )
    }
    geData()
    setInterval(() => geData(), 3000)
    document.addEventListener('keyup', e => {
      if (e.key < 4 && e.key > 0) this.vote(e.key)
    }, false)
    if (!cookie.load('auth')) cookie.save('auth', uniqid())
    if (cookie.load('auth_admin')) this.setState({userName: 'admin'})
  }
  clear = () => {
    req.delete(API_VOTE).then(r => {
      if (r.message === 'Voting results are deleted') {
        this.setState({
          active: 0,
          sum: 0,
          res: {
            option1: 0,
            option2: 0,
            option3: 0
          }})
        this.refs.option1.checked = false
        this.refs.option2.checked = false
        this.refs.option3.checked = false
        console.log('succes')
      }
    })
  }
  handleModalSignIn = () => this.setState({isOpenModalSignIn: !this.state.isOpenModalSignIn})
  signIn = (l, p) => {
    const admin = {
      login: 'admin',
      password: 'admin'
    }
    if ((l === admin.login) && (p === admin.password)) {
      this.setState({userName: 'admin'}, () => cookie.save('auth_admin', 'admin'))
      this.handleModalSignIn()
    }
  }
  loguot = () => this.setState({userName: ''}, () => cookie.remove('auth_admin'))
  render () {
    const isAuth = this.state.userName === 'admin'
    return (
      <div id='main'>
        <ModalSignIn isOpenModalSignIn={this.state.isOpenModalSignIn} handleModalSignIn={this.handleModalSignIn}
          signIn={this.signIn} />
        <div className='header'>
          {isAuth && <h1>{this.state.userName}</h1>}
          {isAuth
            ? <button onClick={this.loguot} className='sing-in'>Logout</button>
            : <button onClick={this.handleModalSignIn} className='sing-in'>Sign In</button>}
        </div>
        <div className='online-wrap'>
          <h1 className='count'>{this.state.online}</h1>
        </div>
        <div className='data'>
          {this.state.data.map((item, k) => (
            <div key={k}>
              <h1 className='question'>{item.question}</h1>
              <div>
                {item.answers.map((i, k) => (
                  <div key={k} className='answer'>
                    <div onClick={() => this.vote(k + 1)} className='inline-op'>
                      <input type='radio' name={item.question} value={i.isCorrect} ref={`option${k + 1}`} />
                      {i.label}
                    </div>
                    <div className='inline-an'>
                      {(this.state.active === k + 1) && <div className='result'><div className='result-fill'
                        style={{width: `${(this.state.res[`option${k + 1}`] / (this.state.sum !== 0 ? this.state.sum : 1)) * 100}%`}}
                      /><span>{this.state.res[`option${k + 1}`]}</span></div>}<br />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isAuth && <div className='clear-button-wrap'>
          <button onClick={this.clear}>Clear Results</button>
        </div>}
      </div>
    )
  }
}
