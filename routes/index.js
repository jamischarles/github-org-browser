var express = require('express');
var router = express.Router();

var githubModel = require('../models/github');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Index'});
});

/**
 * JSON data routes
 */
router.get('/org/:org', async function(req, res, next) {
  var org = req.params.org;
  try {
    var repos = await githubModel.getRepoListForOrg(org);
  } catch (e) {
    var status = e.response.status;
    if (status > 400) {
      return res.sendStatus(404);
    }
  }

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
