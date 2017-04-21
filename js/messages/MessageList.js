import React from 'react';
import ReactDOM from 'react-dom';
import createLogger from '../logger';
import Post from './Post';


const log = createLogger('components.Messages');


export default class MessageList extends React.Component {

  posts = [];

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     shouldScroll: !this.props.preventScroll
  //   }
  // }

  componentDidMount() {
    this._scrollToLast();
  }

  componentDidUpdate() {
    this._scrollToLast();
  }

  render() {
    return (
      <div style={styles.messageList}>
        <div style={{ textAlign: 'center', paddingTop: 50 }}>
          <button
            disabled={!this.props.viewer.messages.pageInfo.hasPreviousPage}
            onClick={ this.props.onLoadMore }
            style={{
              ...styles.loadMoreButton,
              display: this.props.viewer.messages.pageInfo.hasPreviousPage
                ? 'inline-block' : 'none'
            }}
          >
            ^ Older ^
          </button>
        </div>
        {this.props.viewer.messages.edges.map((edge, index) =>
          <Post key={edge.node.id}
                viewer={this.props.viewer}
                message={edge.node}
                onStartEditing={this.props.onStartEditing}
                onDelete={this.props.onDelete}
                ref={(ref) => this.posts = ref}
                highlight={!!(this.props.currentMessage && this.props.currentMessage.id === edge.node.id)}
          />
        )}
      </div>
    );
  }

  _scrollToLast = () => {
    if (!this.posts || this.props.preventScroll) return;
    // const len = this.posts.length - 1;
    const node = ReactDOM.findDOMNode(this.posts);
    log.debug('_scrollToLast', this.props.preventScroll, node, this.posts);
    if (node) {
      node.scrollIntoView();
    }
  };
}


const styles = {
  messageList: {
    padding: 10,
    overflowY: 'auto',
  },
  loadMoreButton: {
    height: 40,
    padding: '0 20px',
    borderRadius: 20,
    border: 0,
    backgroundColor: '#ccc',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
  }
};


