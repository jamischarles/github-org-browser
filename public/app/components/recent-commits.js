import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    var {date, author, author_url} = item;
    return (
      <li style={css.commitListItem} key={i}>
        {item.message} on {date} by{' '}
        <a target="_blank" href={author_url}>
          {author}
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
    axios
      .get(`/org/${orgName}/${repoName}/commits`)
      .then(response => {
        this.setState({
          commitHistory: response.data.commitList,
        });
      })
      .catch(function(error) {
        console.log(error);
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
          <button onClick={this.hideCommitHistory}>Hide recent commits</button>
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
  // orgList: PropTypes.array,
};

var css = {
  commitList: {listStyle: 'none'},
  commitListItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
};
