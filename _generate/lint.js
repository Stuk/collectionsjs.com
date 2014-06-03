var Q = require("q");
var path = require("path");
var fs = require("q-io/fs");
var yaml = require("js-yaml");

Q.all([loadDirectory("../collection"), loadDirectory("../method")])
.spread(function (collectionDocuments, methodDocuments) {
    // console.log(collectionDocuments, methodDocuments);
    // console.log(collectionDocuments);
    Object.keys(collectionDocuments).forEach(function (collectionName) {
        lintCollection(collectionName, collectionDocuments[collectionName], methodDocuments);
    });
})
.done();

function loadDirectory(pathname) {
    var documents = {};

    return fs.list(pathname)
    .then(function (list) {
        return Q.all(list.map(function (filename) {
            var name = path.basename(filename, ".md");
            return fs.read(path.join(pathname, filename))
            .then(function (content) {
                documents[name] = parseDocument(content.toString("utf8"));
            })
            .catch(function (error) {
                error.message = "Could not load " + path.join(pathname, filename) + " because " + error.message;
                throw error;
            });
        })).thenResolve(documents);
    });
}

function parseDocument(content) {
    var document = [];
    yaml.safeLoadAll(content, function (part) {
        document.push(part);
    });
    return document;
}

function lintCollection(collectionName, collectionDocument, methodDocuments) {
    var linters = [lintAllMethodsKnown, lintSymmetricRelation];

    if (!collectionDocument.length) {
        return;
    }

    var warnings;
    try {
        warnings = linters.map(function (linter) {
            return linter(collectionName, collectionDocument, methodDocuments);
        }).filter(function (result) {
            return !!result;
        });
    } catch (error) {
        error.message = "Failed to lint " + collectionName + " because " + error.message;
        throw error;
    }

    if (warnings.length) {
        console.log("Warnings for", collectionName);
        warnings.map(function (warning) {
            console.log("  ", warning);
        });
        console.log();
    }
}

function lintAllMethodsKnown(collectionName, collectionDocument, methodDocuments) {
    var methodNames = Object.keys(methodDocuments);
    var collectionMethods = collectionDocument[0].methods;

    var unknownMethods = collectionMethods.filter(function (name) {
        return methodNames.indexOf(name) === -1;
    });

    if (unknownMethods.length) {
        return "Unknown methods: " + unknownMethods.join(", ");
    }
    return false;
}

function lintSymmetricRelation(collectionName, collectionDocument, methodDocuments) {
    var methodNames = Object.keys(methodDocuments);

    var missingRelations = methodNames.filter(function (methodName) {
        var methodDocument = methodDocuments[methodName];
        return methodDocument[0].collections.indexOf(collectionName) === -1;
    });

    if (missingRelations.length) {
        return "Symetric relation missing from: " + missingRelations.join(", ");
    }
    return false;
}
