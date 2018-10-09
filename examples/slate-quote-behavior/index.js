import QuoteBehavior from 'slate-quote-behavior'
import React from 'react'
import initialValue from './value.json'
import { Editor } from 'slate-react'
import { Value } from 'slate'

/**
 * Quote helpers.
 *
 * @type {Function}
 */

function isQuoteBlock(node) {
  return node.object === 'block' && node.type === 'quote'
}

function isQuoteBlockActive(value) {
  return value.blocks.some(b => !!value.document.getClosest(isQuoteBlock))
}

function wrapQuoteBlock(change) {
  change.wrapBlock('quote')
}

function unwrapQuoteBlock(change) {
  change.unwrapBlock('quote')
}

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {
  plugins = [
    QuoteBehavior({
      isActive: isQuoteBlockActive,
      wrap: wrapQuoteBlock,
      unwrap: unwrapQuoteBlock,
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
      quote: {
        nodes: [
          {
            match: { object: 'block', type: 'paragraph' },
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
      case 'quote':
        return <blockquote {...attributes}>{children}</blockquote>
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
