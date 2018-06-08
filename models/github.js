var axios = require('axios');
var get = require('lodash.get');

// TODO: add rate limiting

async function getRepoListForOrg(org) {
  var url = `https://api.github.com/orgs/${org}/repos`;

  try {
    var result = await axios.get(url);
    return processRepos(result.data);
    // console.log('result', r);
  } catch (e) {
    // FIXME: throw err?
    console.log('e', e);
  }
}

async function getCommitListForRepo(org, repo) {
  var url = `https://api.github.com/repos/${org}/${repo}/commits`;
  try {
    var result = await axios.get(url);
    return processCommitHistory(result.data);
  } catch (e) {
    // FIXME: throw err?
    console.log('e', e);
  }
}

// UTIL functions... TODO: move into utils file at eventually
// FIXME: change fn name...
function processRepos(repoList = []) {
  var list = [];

  repoList.forEach(item => {
    var {name, html_url, description, commits_url} = item;

    var o = {
      name,
      html_url,
      description,
      commits_url,
      forkCount: item.forks_count,
      openIssuesCount: item.open_issues_count,
      starCount: item.stargazers_count,
      lastCommitDate: item.updated_at,
      watcherCount: item.watchers_count,
    };

    list.push(o);
  });

  return list;
}

function processCommitHistory(commitList = []) {
  var list = [];

  commitList.forEach(item => {
    // var {name, html_url, description, commits_url} = item;

    var o = {
      author: item.commit.author.name,
      author_url: get(item, 'author.html_url'),
      message: get(item, 'commit.message'),
      url: item.html_url,
      date: get(item, 'commit.author.date'),
    };

    list.push(o);
  });

  return list;
}

module.exports = {
  getRepoListForOrg,
  getCommitListForRepo,
};
