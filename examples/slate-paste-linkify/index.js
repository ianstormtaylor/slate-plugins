
import PasteLinkify from 'slate-paste-linkify'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor } from 'slate-react'
import { State } from 'slate'

class Example extends React.Component {

  schema = {
    nodes: {
      link: (props) => {
        return (
          <a {...props.attributes} href={props.node.data.get('url')}>
            {props.children}
          </a>
        )
      }
    }
  }

  plugins = [
    PasteLinkify({
      type: 'link',
      hrefProperty: 'url',
      collapseTo: 'end'
    })
  ]

  state = {
    state: State.fromJSON(initialState)
  }

  onChange = ({ state }) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        onChange={this.onChange}
        plugins={this.plugins}
        schema={this.schema}
        state={this.state.state}
      />
    )
  }

}

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
