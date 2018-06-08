import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import RecentCommits from './recent-commits';

export default class RepoList extends React.Component {
  constructor() {
    super();
    this.state = {
      sortBy: 'forkCount',
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
    if (prevProps.orgName != this.props.orgName) {
      this.fetchRepoList();
    }
  }
  fetchRepoList() {
    var {orgName} = this.props;
    axios
      .get(`/org/${orgName}`)
      .then(response => {
        this.setState({
          repoList: response.data.repos,
        });
      })
      .catch(function(error) {
        console.log(error);
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
  render() {
    var {orgName} = this.props;
    var {repoList = []} = this.state;

    var sortedList = this.sortList(this.state.sortBy, repoList);

    var list = sortedList.map((item, i) => {
      return (
        <li key={i} style={css.repoItem}>
          <p style={css.repoMetrics}>
            {item.starCount} stars | {item.forkCount} forks
          </p>
          <h3 style={css.repoTitle}>
            <a style={css.repoTitleLink} target="_blank" href={item.html_url}>
              {item.name}
            </a>
          </h3>
          <p>{item.description}</p>
          <RecentCommits orgName={orgName} repoName={item.name} />
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

        <ul style={css.repoList}>{list}</ul>
      </div>
    );
  }
}

RepoList.propTypes = {
  orgName: PropTypes.string.isRequired,
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
};