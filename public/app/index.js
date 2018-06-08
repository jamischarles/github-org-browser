import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import RepoList from './components/repo-list';

// main component
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      inputVal: '',
      selectedOrg: '',
    };
    this.updateOrgInput = this.updateOrgInput.bind(this);
    this.fetchRepoList = this.fetchRepoList.bind(this);
    this.handleInputEnterKey = this.handleInputEnterKey.bind(this);
  }
  updateOrgInput(e) {
    this.setState({
      inputVal: e.target.value,
    });
  }
  fetchRepoList() {
    this.setState({
      selectedOrg: this.state.inputVal,
    });
  }
  handleInputEnterKey(e) {
    if (e.key === 'Enter') {
      this.fetchRepoList();
    }
  }
  componentDidMount() {}
  render() {
    return (
      <div style={{maxWidth: 710}}>
        <p>Select a GitHub organization to browse </p>
        <input
          className="search"
          style={css.input}
          value={this.props.inputVal}
          placeholder="Enter GitHub organization name"
          onChange={this.updateOrgInput}
          onKeyUp={this.handleInputEnterKey}
        />
        <button style={css.button} onClick={this.fetchRepoList}>
          Submit
        </button>
        <div style={{paddingTop: 40}}>
          {this.state.selectedOrg && (
            <RepoList orgName={this.state.selectedOrg} />
          )}
        </div>
      </div>
    );
  }
}

var css = {
  button: {
    fontSize: 14,
    padding: 10,
  },
  input: {
    fontSize: 14,
    marginRight: 10,
    padding: 10,
    width: 270,
  },
};

ReactDOM.render(<App />, document.querySelector('.main-container'));
