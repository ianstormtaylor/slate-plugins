
import SoftBreak from 'slate-soft-break'
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
      paragraph: (props) => {
        const { attributes, children } = props
        const style = { marginTop: '1em', border: '2px solid #eee' }
        return <p {...attributes} style={style}>{children}</p>
      },
      code: (props) => {
        const { attributes, children } = props
        return <pre {...attributes}><code>{children}</code></pre>
      },
    }
  }

  plugins = [
    SoftBreak({
      onlyIn: ['code'],
    }),
    SoftBreak({
      ignoreIn: ['code'],
      shift: true,
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
        state={this.state.state}
        schema={this.schema}
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
