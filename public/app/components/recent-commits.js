import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import axios from 'axios';

// FIXME: move this to utils
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

var LoadCommitHistoryButton = props => {
  return (
    <button type="button" onClick={props.clickHandler}>
      Show recent commits
    </button>
  );
};

class CommitListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isOpen: false,
      diff: '',
      // diffUrl: get(props, 'details.html_url') + '.diff', // FIXME: add Get
      diffUrl: get(props, 'details.url'), // FIXME: add Get
    };

    this.toggleListItem = this.toggleListItem.bind(this);
    this.fetchDiff = this.fetchDiff.bind(this);
  }
  toggleListItem() {
    this.setState({
      isOpen: !this.state.isOpen,
    });

    this.fetchDiff();
  }
  fetchDiff() {
    // if (!this.state.diff) {
    // }
    //
    //
    var url = this.state.diffUrl;

    // FIXME: add spinner...
    //
    //
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
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    var {details} = this.props;
    // FIXME: use _get?
    // var {date, author, author_url, url} = item;

    var author = details.commit.author.name;
    var author_url = get(details, 'author.html_url');
    var message = get(details, 'commit.message');
    var url = details.html_url;
    var date = get(details, 'commit.author.date');

    // short desc if collapsed
    if (!this.state.isOpen) {
      return <div onClick={this.toggleListItem}>{author}</div>;
    }

    // long desc after expanding
    return (
      <div>
        <span style={css.long.message}>{message}</span> by{' '}
        <a
          style={{color: 'inherit'}}
          target="_blank"
          title="Show author"
          href={author_url}>
          {author}
        </a>{' '}
        on{' '}
        <a
          style={{color: 'inherit'}}
          href={url}
          title="Show diff"
          target="_blank">
          {date}
        </a>
        <div style={css.commitDiff}>{this.state.diff}</div>
      </div>
    );
  }
}

// FIXME
// <pre style={css.commitDiff}>
// <code>{this.state.diff}</code>
// </pre>

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
        // FIXME: add error state
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
          <button style={{marginBottom: 5}} onClick={this.hideCommitHistory}>
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
  long: {
    message: {
      backgroundColor: 'white',
      border: '1px solid #eee',
      padding: '2px 6px',
    },
  },
  commitList: {listStyle: 'none'},
  commitListItem: {
    fontSize: 13,
    lineHeight: '18px',
    // color: '#666',
    color: '#353535',
    marginBottom: 12,
  },

  preRow: {
    margin: 0,
  },
  commitDiff: {
    border: '1px solid #eee',
    overflow: 'scroll',
    fontSize: 12,
    // whiteSpace: 'pre-wrap',
  },
};
