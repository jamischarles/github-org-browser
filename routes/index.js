var express = require('express');
var router = express.Router();

var githubModel = require('../models/github');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Index'});
});

// router.get('/org/:org', async (req, res, next) => {
//   var org = req.params.org;
//   var repos = await githubModel.getRepoListForOrg(org);
//   console.log('repos', repos);
//   res.render('orgviewer', {title: 'Org Viewer', org: org, repoList: repos});
// });

/**
 * JSON data routes
 */

router.get('/org/:org', async function(req, res, next) {
  var org = req.params.org;
  var repos = await githubModel.getRepoListForOrg(org);
  // TODO: add err handling
  res.json({
    org,
    repos,
  });
});

router.get('/org/:org/:repo/commits', async (req, res, next) => {
  var {org, repo} = req.params;
  var commits = await githubModel.getCommitListForRepo(org, repo);
  res.json({
    org,
    repo,
    commitList: commits,
  });
});

module.exports = router;
