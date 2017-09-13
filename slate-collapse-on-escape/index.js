
import CollapseOnEscape from 'slate-collapse-on-escape'
import React from 'react'
import initialState from './state.json'
import { Editor } from 'slate-react'
import { State } from 'slate'

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {

  schema = {
    nodes: {
      code: props => <pre {...props.attributes}><code>{props.children}</code></pre>
    }
  }

  plugins = [
    CollapseOnEscape()
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

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
