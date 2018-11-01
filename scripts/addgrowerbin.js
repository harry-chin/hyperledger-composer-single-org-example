/*
 * Copyright (C) 2018 BlockBit Technology Solutions. All Rights Reserved.
 */

"use strict";

var NS = "model";

var Axios = require("axios");
var Path = require('path');

var http = Axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    }
});

var log = function (input) {
    console.log("log: ", input);
}

var growerBins = [
    {
        "growerBin": {
            "$class": "model.GrowerBin",
            "productCode": "PL",
            "producerId": "string",
            "origin": "grower1",
            "processedDate": "18:30:21.132 Mon.17/September/2018",
            "weight": 120,
            "id": "GB-201800000001",
            "owner": "resource:model.Company#grower-001"
        },
        "eventData": {
            "$class": "model.EventData",
            "eventType": "Picked",
            "summary": "string",
            "location": "Yarra Valley, VIC",
            "id": "PICK-201800000001",
            "owner": "resource:model.Company#grower-001"
        }
    },
    {
        "growerBin": {
            "$class": "model.GrowerBin",
            "productCode": "PL",
            "producerId": "string",
            "origin": "grower2",
            "processedDate": "19:30:21.132 Mon.17/September/2018",
            "weight": 120,
            "id": "GB-201800000002",
            "owner": "resource:model.Company#grower-002"
        },
        "eventData": {
            "$class": "model.EventData",
            "eventType": "Picked",
            "summary": "string",
            "location": "Yarra Valley, VIC",
            "id": "PICK-201800000002",
            "owner": "resource:model.Company#grower-002"
        }
    }

];

var service = {
    createAssets: function (rest, ids, model) {
        return service._doBatch("createAsset", rest, ids, model);
    },

    createAsset: function (rest, data, model) {
        return service.create(rest, data, model);
    },

    deleteAssets: function (rest, ids) {
        return service._doBatch("deleteAsset", rest, ids);
    },

    deleteAsset: function (rest, id) {
        return service.deleteIfExists(rest, id);
    },

    exists: function (path, id) {
        return http.request({
            url: Path.join(path, id),
            method: "head"
        }).then(function (result) {
            // if the url exists, we assume the entity exists
            return true;
        }).catch(function (err) {
            return false;
        });
    },

    create: function (path, data, $class) {
        return http.request({
            url: path,
            method: "post",
            data: Object.assign({}, data, {
                "$class": $class
            })
        });
    },

    deleteIfExists: function (path, id) {
        return service.exists(path, id)
            .then(function (exists) {
                if (exists) {
                    return http.request({
                        url: Path.join(path, id),
                        method: "delete"
                    });
                }
            });
    },

    _doBatch: function (operation, rest, data, model) {

        model = model || "";
        if (data.length > 0) {
            var jobs = [];
            for (var i = 0; i < data.length; i++) {
                jobs[i] = service[operation](rest, data[i], model)
            }
            return Promise.all(jobs);
        } else {
            return Promise.resolve();
        }
    },

    // setup companies, shipments, products, containers
    setupData: function () {
        return utils.chain([

            // ## Delete Data

            function () {
                console.log("Deleting Create Grower Bins EventData");
                return service.deleteAssets("/EventData", utils.getValues(growerBins, "eventData.id"));
            },

            // ## Create Data
            function () {
                console.log("Creating GrowerBins");
                return service.createAssets("/CreateGrowerBin", growerBins, "model.CreateGrowerBin");
            }
        ])
    }
}

var utils = {
    chain: function (sources) {
        var seq = Promise.resolve();
        sources.forEach(function (source) {
            seq = seq.then(function () {
                return typeof source === "function" ? source() : source;
            });
        });
        return seq;
    },
    getValues: function (obj, propPath) {
        var values = [];
        for (var k in obj) {
            values[values.length] = Objects.getValue(obj[k], propPath);
        }
        return values
    },
}

var PATH_NODE_REGEX = new RegExp("[^.\\[\\]]+", "g");
var INVALID_NODE_REGEX = new RegExp("\\s|\\.\\.|\\[\\[|\\]\\]|\\[\\]", "g");

var Objects = {
    getValue: function (obj, path) {
        if (arguments.length === 1) {
            return obj;
        }
        path = Objects.getPropertyPathArray(path);
        if (path.length === 0) {
            return obj;
        }
        if (!(obj instanceof Object)) {
            return obj;
        }
        var node = obj;
        for (var i = 0; i < path.length; i++) {
            if (node[path[i]] == null) {
                return undefined;
            }
            node = node[path[i]];
        }
        return node;
    },
    getPropertyPathArray: function (arg) {
        if (arg instanceof Array) {
            return arg;
        } else if (typeof arg === "string") {
            return Objects.parsePropertyPath(arg);
        } else {
            throw new TypeError("Unable to parse the argument. The path should be expressed in a string or array.", arg);
        }
    },
    parsePropertyPath: function (pathStr) {
        // Objects.checkString(pathStr);
        INVALID_NODE_REGEX.lastIndex = 0;
        if (INVALID_NODE_REGEX.test(pathStr)) {
            throw new Error("Invalid path expression.");
        }
        var result = [];
        var match = null;
        PATH_NODE_REGEX.lastIndex = 0;
        while ((match = PATH_NODE_REGEX.exec(pathStr)) != null) {
            if (pathStr[match.index - 1] === "[" && pathStr[match.index + match[0].length] === "]" && !isNaN(match[0])) {
                // if it can be converted into a number
                match[0] = Number(match[0]);
            }
            result[result.length] = match[0];
        }
        return result;
    }
};

service.setupData().catch(log);