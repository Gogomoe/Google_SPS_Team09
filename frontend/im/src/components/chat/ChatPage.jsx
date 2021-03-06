import React from 'react'
import { Button, Card, Divider, List, PageHeader, message } from 'antd'
import MsgEntry from './MsgEntry'
import SendMsg from './SendMsg'
import { Context } from '../../context/ContextSource'
import './ChatPage.css'
import PropTypes from 'prop-types'

class ChatPage extends React.Component {
  constructor (props) {
    super(props)
    this.wrapper = React.createRef()
    this.textarea = React.createRef()
    this.state = {
      msgs: [],
      roomId: props.match.params.roomid
    }
  }

  static contextType = Context;

  static get propTypes () {
    return {
      history: PropTypes.any,
      match: PropTypes.any
    }
  }

  componentDidMount () {
    if (!this.context.conn) {
      this.props.history.push(`/room/${this.state.roomId}`)
      return
    }
    this.context.conn.addHandler('push messages', (data) => {
      for (const msg of data.messages) {
        this.setState((prevState) => ({
          msgs: [...prevState.msgs, msg]
        }))
        console.log(this.state.msgs)
        console.log(
          '[message received] ' + msg.owner.name + ': ' + msg.content
        )
      }
    })
  }

  handleInviteMember () {
    // TODO: show the invite page.
  }

  handleExit = () => {
    this.props.history.push('/')
    this.context.setConn(null)
  }

  render () {
    if (!this.context.userid) return null
    const { msgs } = this.state
    return (
      <div id='main'>
        <div className='site-page-header-ghost-wrapper'>
          <PageHeader
            ghost={false}
            title={this.context.roomName}
            subTitle={this.context.username}
            extra={[
              <Button key='invite' onClick={this.handleInviteMember}>
                Invite Member
              </Button>,
              <Button key='exit' onClick={this.handleExit}>
                Exit
              </Button>
            ]}
          />
        </div>
        <Card>
          <List
            className='msg-list'
            itemLayout='horizontal'
            dataSource={msgs}
            renderItem={(item) => <MsgEntry item={item} />}
          />
          <Divider />
          <SendMsg />
        </Card>
      </div>
    )
  }
}

export default ChatPage
