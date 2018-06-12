import React from 'react';
import PropTypes from 'prop-types';

import RecentCommits from './recent-commits';

export default class RepoList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      orgName: props.match.params.orgName, // pulled from the url. FIXME: add get(?
      sortBy: 'forkCount',
      errorMsg: '',
    };

    this.fetchRepoList = this.fetchRepoList.bind(this);
    this.updateSorting = this.updateSorting.bind(this);
  }
  // Called first time list is rendered
  componentDidMount() {
    this.fetchRepoList();
  }
  // called when input changes subsequent times
  componentDidUpdate(prevProps) {
    // only make ajax calls when orgName actually changes
    // FIXME: update this?
    if (prevProps.orgName != this.props.orgName) {
      this.fetchRepoList();
    }
  }
  fetchRepoList() {
    var {orgName} = this.state;

    var url = `https://api.github.com/orgs/${orgName}/repos`;
    // FIXME: move this somewhere else?
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(repos => {
        // console.log('repo response', myJson);
        this.setState({
          repoList: repos,
          errorMsg: '',
        });
      })
      .catch(error => {
        // FIXME: test the response type with fetch...
        if (error.response.status > 400) {
          this.setState({
            errorMsg:
              'That GitHub organization does not exist. Please change the search term. ',
            repoList: undefined,
          });
        }
        console.log('error', error);
      });
  }
  updateSorting(e) {
    this.setState({
      sortBy: e.target.value,
    });
  }
  sortList(sortBy, list) {
    return list.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return -1;
      }
      return 0;
    });
  }
  renderError() {
    return <div style={css.errorMsg}>{this.state.errorMsg}</div>;
  }
  render() {
    var {orgName, repoList = []} = this.state;

    var sortedList = this.sortList(this.state.sortBy, repoList);

    var list = sortedList.map((item, i) => {
      return (
        <li key={i} style={css.repoItem}>
          <p style={css.repoMetrics}>
            {item.stargazers_count} stars | {item.forks_count} forks
          </p>
          <h3 style={css.repoTitle}>
            <a style={css.repoTitleLink} target="_blank" href={item.html_url}>
              {item.name}
            </a>
          </h3>
          <p>{item.description}</p>
          <RecentCommits
            {...this.props}
            orgName={orgName}
            repoName={item.name}
          />
        </li>
      );
    });

    return (
      <div>
        <div>
          <div style={{float: 'right'}}>
            Sort by{' '}
            <select value={this.state.sortBy} onChange={this.updateSorting}>
              <option value="forkCount">Popularity</option>
              <option value="starCount">Vanity Metrics</option>
            </select>
          </div>
          <h2>
            <span style={css.superTitle}>Showing repositories for</span>
            <span style={{color: '#a0a0a0'}}>github.com/</span>
            {orgName}
          </h2>
        </div>

        {this.state.errorMsg && this.renderError()}

        <ul style={css.repoList}>{list}</ul>
      </div>
    );
  }
}

RepoList.propTypes = {
  orgList: PropTypes.array,
};

var css = {
  repoTitle: {
    fontSize: 20,
    marginTop: 10,
  },
  superTitle: {
    fontSize: 12,
    display: 'block',
    fontWeight: 'normal',
  },
  repoTitleLink: {
    color: 'inherit',
  },
  repoList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  repoMetrics: {
    color: '#666',
    fontSize: 12,
    float: 'right',
  },
  repoItem: {
    border: '1px solid #b5b5b5',
    // borderRadius: 9,
    marginBottom: 10,
    padding: '5px 15px 10px 15px',
  },
  errorMsg: {
    backgroundColor: '#ff4949',
    padding: 12,
    border: '1px solid #b90000',
    color: 'white',
  },
};
