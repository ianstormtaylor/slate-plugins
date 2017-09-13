
import SoftBreak from 'slate-soft-break'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor } from 'slate-react'
import { State } from 'slate'

class Example extends React.Component {

  schema = {
    nodes: {
      code: props => <pre {...props.attributes}><code>{props.children}</code></pre>
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

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
