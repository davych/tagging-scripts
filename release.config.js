module.exports = {
  tagFormat: 'v${version}',
  repositoryUrl: "git@github.com:davych/tagging-scripts.git",
  "branches": [
    {name: 'main'},
    {name: 'beta', channel: 'beta', prerelease: 'beta'},
  ],
  "plugins": [
    '@semantic-release/commit-analyzer', 
    '@semantic-release/release-notes-generator', 
    ["@semantic-release/npm", {
      "npmPublish": true,
      "tarballDir": "dist"
    }],
    '@semantic-release/github',
    ['@semantic-release/git', {
      "assets": [],
      "message": "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}"
    }]
  ]
}