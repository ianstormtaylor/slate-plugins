
import AutoReplace from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

class Example extends React.Component {

  nodes = {
    blockquote: props => <blockquote {...props.attributes}><p>{props.children}</p></blockquote>,
    hr: props => <hr />,
    ul: props => <ul {...props.attributes}>{props.children}</ul>,
    li: props => <li {...props.attributes}>{props.children}</li>,
    h: props => {
      const { attributes, children, node } = props
      const level = node.data.get('level')
      const Tag = `h${level}`
      return <Tag {...attributes}>{children}</Tag>
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
  ];

  state = {
    state: Raw.deserialize(initialState, { terse: true })
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
