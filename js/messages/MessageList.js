import React from 'react';
import ReactDOM from 'react-dom';
import createLogger from '../logger';
import Post from './Post';


const log = createLogger('components.Messages');


const styles = {
  messageList: {
    padding: 10,
    // display: 'flex',
    // flex: 'auto',
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    overflowY: 'auto',
  },
};


export default class MessageList extends React.Component {

  posts = [];

  // constructor(props) {
  //   super(props);
  //   this.state = { loadMore: this.props.loadMore }
  // }

  componentDidMount() {
    this._scrollToLast();
  }

  componentDidUpdate() {
    log.debug('componentDidUpdate');
    this._scrollToLast();
  }

  render() {
    return (
      <div style={styles.messageList}>
        <div>
          <button
            disabled={!this.props.viewer.messages.pageInfo.hasPreviousPage}
            onClick={ this.props.onLoadMore }>
            more...
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
    if (! this.post || this.props.loadMore) return;
    // const len = this.posts.length - 1;
    const node = ReactDOM.findDOMNode(this.posts);
    log.debug('_scrollToLast', this.props.loadMore, node, this.posts);
    if (node) {
      node.scrollIntoView();
    }
  };

}
