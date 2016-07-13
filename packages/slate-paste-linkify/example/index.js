
import PasteLinkify from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

class Example extends React.Component {

  nodes = {
    link: (props) => {
      return (
        <a
          {...props.attributes}
          href={props.node.data.get('url')}
        >
          {props.children}
        </a>
      )
    }
  }

  plugins = [
    PasteLinkify({
      type: 'link',
      hrefProperty: 'url',
      collapseTo: 'end'
    })
  ];

  state = {
    state: Raw.deserialize(initialState)
  };

  onChange = (state) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        onChange={this.onChange}
        plugins={this.plugins}
        state={this.state.state}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode = (node) => {
    return this.nodes[node.type]
  }

}

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
