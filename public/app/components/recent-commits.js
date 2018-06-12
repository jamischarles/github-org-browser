import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

var LoadCommitHistoryButton = props => {
  return (
    <button type="button" onClick={props.clickHandler}>
      Show recent commits
    </button>
  );
};

var CommitList = props => {
  var {list} = props;

  var history = list.map((item, i) => {
    // FIXME: use _get?
    // var {date, author, author_url, url} = item;

    var author = item.commit.author.name;
    var author_url = get(item, 'author.html_url');
    var message = get(item, 'commit.message');
    var url = item.html_url;
    var date = get(item, 'commit.author.date');

    return (
      <li style={css.commitListItem} key={i}>
        <span>{message}</span> by{' '}
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
      </li>
    );
  });

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
  commitList: {listStyle: 'none'},
  commitListItem: {
    fontSize: 13,
    lineHeight: '18px',
    // color: '#666',
    color: '#353535',
    marginBottom: 12,
  },
};
