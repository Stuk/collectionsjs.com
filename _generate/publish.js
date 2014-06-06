
var path = require("path");
var GitFs = require("q-git/fs");
var Generate = require("./generate");
var fs = require("q-io/fs");

var repo = {};
repo.rootPath = path.join(__dirname, "..", ".git");
require("git-node-fs/mixins/fs-db")(repo, repo.rootPath);
require('js-git/mixins/create-tree')(repo);
require('js-git/mixins/pack-ops')(repo);
require('js-git/mixins/walkers')(repo);
require('js-git/mixins/read-combiner')(repo);
require('js-git/mixins/formats')(repo);

var gitFs = new GitFs(repo);

gitFs.load("refs/heads/gh-pages")
.then(function () {
    return gitFs.removeTree("/");
})
.then(function () {
    return Generate.build(gitFs);
})
.then(function () {
    return gitFs.commit({
        author: {name: "Collections Bot", email: "kris@cixar.com"},
        message: "Build"
    })
})
.then(function () {
    return gitFs.save();
})
.done();

