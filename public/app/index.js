import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import get from 'lodash/get';

import RepoList from './components/repo-list';

// main component
class Main extends React.Component {
  constructor(props) {
    super();
    this.state = {
      // allows refresh
      inputVal: get(props, 'match.params.orgName') || '',
      selectedOrg: get(props, 'match.params.orgName') || '',
    };
    this.updateOrgInput = this.updateOrgInput.bind(this);
    this.fetchRepoList = this.fetchRepoList.bind(this);
    this.handleInputEnterKey = this.handleInputEnterKey.bind(this);
  }
  updateOrgInput(e) {
    var newVal = e.target.value;
    this.setState({
      inputVal: newVal,
      selectedOrg: '',
    });

    this.props.history.replace(`/org/${newVal}`);
  }
  clearInput() {
    this.setState({
      inputVal: '',
      selectedOrg: '',
    });
  }
  fetchRepoList() {
    this.setState(
      {
        selectedOrg: this.state.inputVal,
      },
      () => {
        this.props.history.push(`/org/${this.state.selectedOrg}`);
      },
    );
  }
  handleInputEnterKey(e) {
    if (e.key === 'Enter') {
      this.fetchRepoList();
    }
  }
  render() {
    return (
      <div style={{maxWidth: 710}}>
        <p>Select a GitHob organization to browse </p>
        <input
          className="search"
          style={css.input}
          value={this.state.inputVal}
          placeholder="Enter GitHub organization name"
          onChange={this.updateOrgInput}
          onKeyUp={this.handleInputEnterKey}
        />
        <button style={css.button} onClick={this.fetchRepoList}>
          Submit
        </button>

        <Link className="hoverLinkStyle" onClick={this.clearInput} to="/">
          Clear
        </Link>
        <div style={{paddingTop: 40}}>
          {this.state.selectedOrg && (
            <Route
              path={`/org/:orgName`}
              render={props => <RepoList {...props} />}
            />
          )}
        </div>
      </div>
    );
  }
}

// optional params so we can pass orgName to input on refresh
var App = props => <Route path="/:org?/:orgName?" component={Main} />;

var css = {
  button: {
    fontSize: 14,
    padding: 10,
    marginRight: 10,
  },
  input: {
    fontSize: 14,
    marginRight: 10,
    padding: 10,
    width: 270,
  },
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('.main-container'),
);
