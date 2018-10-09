import ListBehavior from 'slate-list-behavior'
import React from 'react'
import initialValue from './value.json'
import { Editor } from 'slate-react'
import { Value } from 'slate'

/**
 * List helpers.
 *
 * @type {Function}
 */

function isListBlock(node) {
  return node.object === 'block' && node.type === 'list'
}

function isListBlockActive(value) {
  return value.blocks.some(b => !!value.document.getClosest(isListBlock))
}

function wrapListBlock(change) {
  change.wrapBlock('list')
}

function unwrapListBlock(change) {
  change.unwrapBlock('list')
}

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {
  plugins = [
    ListBehavior({
      isActive: isListBlockActive,
      wrap: wrapListBlock,
      unwrap: unwrapListBlock,
    }),
  ]

  schema = {
    blocks: {
      paragraph: {
        nodes: [
          {
            match: { object: 'text' },
          },
        ],
      },
      list_item: {
        nodes: [
          {
            match: [
              { object: 'block', type: 'paragraph' },
              { object: 'block', type: 'ordered_list' },
              { object: 'block', type: 'unordered_list' },
            ],
          },
        ],
      },
      ordered_list: {
        nodes: [
          {
            match: { object: 'block', type: 'list_item' },
          },
        ],
      },
      unordered_list: {
        nodes: [
          {
            match: { object: 'block', type: 'list_item' },
          },
        ],
      },
    },
  }

  state = {
    value: Value.fromJSON(initialValue),
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        schema={this.schema}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode(props) {
    const { node, attributes, children } = props
    switch (node.type) {
      case 'unordered_list':
        return <ul {...attributes}>{children}</ul>
      case 'ordered_list':
        return <ol {...attributes}>{children}</ol>
      case 'list_item':
        return <li {...attributes}>{children}</li>
      case 'paragraph':
        return <p {...attributes}>{children}</p>
    }
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
