module.exports = {
  tagFormat: 'v${version}',
  "branches": [
    {name: 'main'},
    {name: 'beta', channel: 'beta', prerelease: 'beta'},
  ],
  "plugins": [
    '@semantic-release/commit-analyzer', 
    '@semantic-release/release-notes-generator', 
    [
      "@semantic-release/github",
      {
        "successComment": false,
        "failTitle": false
      }
    ],
    ["@semantic-release/npm", {
      "npmPublish": true,
      "tarballDir": "dist"
    }],
    ['@semantic-release/git', {
      "assets": ['package.json', 'package-lock.json', 'dist'],
      "message": "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}"
    }]
  ]
}