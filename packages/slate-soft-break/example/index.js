
import SoftBreak from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

class Example extends React.Component {

  nodes = {
    code: props => <pre {...props.attributes}><code>{props.children}</code></pre>
  }

  plugins = [
    SoftBreak({
      onlyIn: ['code']
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
