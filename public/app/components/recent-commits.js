import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import axios from 'axios';

var LoadCommitHistoryButton = props => {
  return (
    <button
      style={css.toggleCommitsBtn}
      type="button"
      onClick={props.clickHandler}>
      Show recent commits
    </button>
  );
};

class CommitListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isOpen: false,
      isLoading: false,
      diff: '',
      diffUrl: get(props, 'details.url'),
    };

    this.toggleListItem = this.toggleListItem.bind(this);
    this._fetchDiff = this._fetchDiff.bind(this);
    this.fetchDiff = this.fetchDiff.bind(this);
  }
  toggleListItem() {
    this.setState({
      isOpen: !this.state.isOpen,
      diff: '',
    });

    if (!this.state.diff) {
      this.fetchDiff();
    }
  }

  fetchDiff() {
    this.setState({isLoading: true});
    // delay by a tiny bit so we don't get disorienting flash of spinner
    setTimeout(this._fetchDiff, 400);
  }
  _fetchDiff() {
    var url = this.state.diffUrl;

    var opt = {
      method: 'GET',
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        Accept: 'application/vnd.github.diff',
      },
      url,
    };

    axios(opt)
      .then(response => {
        this.setState({
          diff: processDiff(response.data),
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }

  render() {
    var messageClass;
    var {details} = this.props;

    var author = get(details, 'commit.author.name');
    var author_url = get(details, 'author.html_url');
    var message = get(details, 'commit.message');
    var url = details.html_url;
    var date = get(details, 'commit.author.date');

    // short desc if collapsed
    if (this.state.isOpen) {
      messageClass = 'hoverLinkStyle';
    } else {
      messageClass = 'truncate hoverLinkStyle';
    }

    return (
      <div>
        <p
          onClick={this.toggleListItem}
          className={messageClass}
          title={message}
          style={css.long.message}>
          {message}
        </p>{' '}
        <div style={css.meta}>
          {details.sha.substring(0, 7)} by{' '}
          <a
            style={{color: 'inherit'}}
            target="_blank"
            title="View author on GitHub"
            href={author_url}>
            {author}
          </a>{' '}
          <a
            style={{color: 'inherit'}}
            href={url}
            title="View diff on GitHub"
            target="_blank">
            {date}
          </a>
        </div>
        {this.state.isLoading && <div className="loader" />}
        {this.state.diff && <div style={css.commitDiff}>{this.state.diff}</div>}
      </div>
    );
  }
}

var CommitList = props => {
  var {list} = props;

  var history = list.map(item => (
    <li style={css.commitListItem} key={item.sha}>
      <CommitListItem details={item} />
    </li>
  ));

  return <ul style={css.commitList}>{history}</ul>;
};

export default class RecentCommits extends React.Component {
  constructor() {
    super();
    this.state = {};

    this.loadCommitHistory = this.loadCommitHistory.bind(this);
    this.hideCommitHistory = this.hideCommitHistory.bind(this);
  }
  loadCommitHistory() {
    var {orgName, repoName} = this.props;
    console.log('this.props', this.props);

    var url = `https://api.github.com/repos/${orgName}/${repoName}/commits`;

    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(commitList => {
        this.setState({
          commitHistory: commitList,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  hideCommitHistory() {
    this.setState({
      commitHistory: undefined,
    });
  }
  render() {
    var {repoList = []} = this.state;

    if (!this.state.commitHistory) {
      return <LoadCommitHistoryButton clickHandler={this.loadCommitHistory} />;
    } else {
      return (
        <div>
          <button
            style={Object.assign({}, css.toggleCommitsBtn, {marginBottom: 10})}
            onClick={this.hideCommitHistory}>
            Hide recent commits
          </button>
          <CommitList list={this.state.commitHistory} />
          <button onClick={this.hideCommitHistory}>Hide commit history</button>
        </div>
      );
    }
  }
}

RecentCommits.propTypes = {
  orgName: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
};

var css = {
  meta: {
    fontSize: 12,
    marginLeft: 7,
  },
  long: {
    message: {
      backgroundColor: 'white',
      border: '1px solid #eee',
      padding: '2px 6px',
      marginBottom: 0,
      marginTop: 0,
    },
  },
  commitList: {listStyle: 'none', paddingLeft: 20},
  commitListItem: {
    fontSize: 13,
    lineHeight: '18px',
    // color: '#666',
    color: '#353535',
    marginBottom: 12,
  },
  toggleCommitsBtn: {
    fontSize: 12,
    padding: '6px 8px',
  },
  preRow: {
    margin: 0,
  },
  commitDiff: {
    border: '3px solid #eee',
    overflow: 'scroll',
    fontSize: 12,
    marginTop: 20,
    // whiteSpace: 'pre-wrap',
  },
};

// TODO: move this to utils file
function processDiff(rawDiff) {
  var lines = rawDiff.split('\n');
  var metaBlock = false;

  // color diff lines
  var output = lines.map((line, i) => {
    var className = '';

    // color meta block
    if ((metaBlock && !line.startsWith('@@ ')) || line.startsWith('diff ')) {
      className = 'git-meta';
      metaBlock = true; //start metablock
    } else if (line.startsWith('@@ ')) {
      className = 'git-meta';
      metaBlock = false; //end metablock
    }

    if (!metaBlock && line.startsWith('+')) {
      className = 'git-add';
    } else if (!metaBlock && line.startsWith('-')) {
      className = 'git-remove';
    }

    return (
      <pre key={i} style={css.preRow} className={className}>
        {line}
      </pre>
    );
  });
  // var output = rawDiff.replace(/^\+/, 'hi');
  return output;
}
