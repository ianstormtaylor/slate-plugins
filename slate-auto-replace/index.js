
import AutoReplace from 'slate-auto-replace'
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
      blockquote: (props) => {
        return <blockquote {...props.attributes}><p>{props.children}</p></blockquote>
      },
      hr: (props) => {
        return <hr />
      },
      ul: (props) => {
        return <ul {...props.attributes}>{props.children}</ul>
      },
      li: (props) => {
        return <li {...props.attributes}>{props.children}</li>
      },
      h: (props) => {
        const { attributes, children, node } = props
        const level = node.data.get('level')
        const Tag = `h${level}`
        return <Tag {...attributes}>{children}</Tag>
      },
    }
  }

  plugins = [
    AutoReplace({
      trigger: ')',
      before: /(\(c)$/i,
      transform: transform => transform.insertText('©')
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(>)$/,
      transform: transform => transform.setBlock('blockquote')
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.setBlock('li').wrapBlock('ul')
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(#{1,6})$/,
      transform: (transform, e, data, matches) => {
        const [ hashes ] = matches.before
        const level = hashes.length
        return transform.setBlock({
          type: 'h',
          data: { level }
        })
      }
    }),
    AutoReplace({
      trigger: 'enter',
      before: /^(-{3})$/,
      transform: (transform) => {
        return transform.setBlock({
          type: 'hr',
          isVoid: true
        })
      }
    })
  ]

  state = {
    state: State.fromJSON(initialState),
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
