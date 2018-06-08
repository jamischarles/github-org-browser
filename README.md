Github Org Browser
=======

This is a React SPA. React entry file can be found at `public/app/index.js`

- Inline React styles for CSS.
- JSX for templating.
- Express for server.

Running it locally
========
1. `git clone https://github.com/jamischarles/github-org-browser.git`
2. `cd github-org-browser`
3. `npm install`
4. `npm run start:dev`
5. Open `http://localhost:3000/` in your browser

Tested with Node 8.


Framework Decisions
========
When I build the first iteration of any tool, I optimize for speed and feature set. I know React and Express well, so I chose that.

Here's how I proceed next:

### First iteration
- Build something quickly to try out feature set.
- Stack doesn't matter. No tests, no linting, minimal error handling.

### Second iteration
- Based on user feedback / observation, improve feature set.
- Fix biggest bugs. 

### Third iteration
- Once feature set becomes more stable, start adding tests, linting
- Evaluate current stack, and swap out problematic tools. Use more / less
	frameworks and abstractions as appropriate.

Biggest Concerns
========
GitHub API rate limiting is going to be the first painpoint here. To alleviate those scaling issues, next I'd cache the API calls for a few hours. Beyond that, we can add an API key to increase the limit. 

If we are still running into issues, I'd set a soft limit for each user, and 
encourage users who've hit that limi to connect their GitHub account so they can use their own rate limit.

Demo
========
![](https://raw.github.com/jamischarles/github-org-browser/master/screenshots/demo.gif)
