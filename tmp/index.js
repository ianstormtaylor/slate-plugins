
import Plain from 'slate-plain-serializer'
import React from 'react'
import { Editor } from 'slate-react'

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Plain.deserialize('This is editable plain text, just like a <textarea>!')
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render = () => {
    return (
      <Editor
        placeholder={'Enter some plain text...'}
        state={this.state.state}
        onChange={this.onChange}
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
