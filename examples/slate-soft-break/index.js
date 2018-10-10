import SoftBreak from 'slate-soft-break'
import When from 'slate-when'
import React from 'react'
import initialValue from './value.json'
import { Editor } from 'slate-react'
import { Value } from 'slate'

export default class Example extends React.Component {
  plugins = [
    When({
      when: value => value.blocks.every(b => b.type === 'code'),
      plugin: SoftBreak(),
    }),
    When({
      when: value => !value.blocks.some(b => b.type === 'code'),
      plugin: SoftBreak({ shift: true }),
    }),
  ]

  state = {
    value: Value.fromJSON(initialValue),
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode(props, next) {
    const { node, attributes, children } = props
    switch (node.type) {
      case 'paragraph':
        const style = { marginTop: '1em', border: '2px solid #eee' }
        return (
          <p {...attributes} style={style}>
            {children}
          </p>
        )
      case 'code':
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        )
      default:
        return next()
    }
  }
}
