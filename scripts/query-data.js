/*
 * Copyright (C) 2018 BlockBit Technology Solutions. All Rights Reserved.
 */

"use strict";

var Axios = require("axios");
var Path = require('path');

var http = Axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8",
    }
});

var service = {
    find: function (path, field, filter) {
        var cond = {};
        cond[field] = filter;

        //TODO URI Encode
        var request = path + "?filter=" + encodeURIComponent(JSON.stringify({
            "where": cond
        }));
        //console.log("Request:", request);

        return http.request({
            url: request,
            method: "get",
            responseType: "json"
        });
    },

    //TODO: Permissions need to be done properly (Currently just faked)
    getDataConsumer: function (id) {
        //Add any exclusions here
        var exclusions = ['CreatedContainer', 'ItemsAdded', 'UpdatedShipment', 'CreatedShipment'];

        getData(id, exclusions).then(d => {
            console.log(d)
        });
    },

    getData9Mile: function (id) {
        var exclusions = [];

        getData(id, exclusions).then(d => {
            console.log(d)
        });
    },

    getDataWoolworths: function (id) {
        var exclusions = [];

        getData(id, exclusions).then(d => {
            console.log(d)
        });
    },
}

async function getData(id, exclusions) {
    //TODO We have to write permission when we move to fabric... composer can't dynamically allocated permissions
    var qualifiedId = 'resource:model.Product#' + id;
    var data = {};

    return getObjectData(qualifiedId)
        .then(d => {
            data = d;
            return getObjectTree(qualifiedId, []);
        })
        .then(d => {
            var jobs = [];
            for (var i = 0; i < d.length; i++) {
                jobs.push(getEventData(d[i]));
            }
            return jobs;
        }).then(d => {
            return Promise.all(d);
        }).then(d => {
            var eventData = [];
            //each d[i] is an array of events attached to a single object
            for (var i = 0; i < d.length; i++) {
                //d[i][j] is a single event data of an object
                for (var j = 0; j < d[i].length; j++) {
                    if (checkAccess(d[i][j].eventType, exclusions)) {
                        eventData.push(d[i][j]);
                    }
                }
            }

            eventData.sortBy(function () {
                return this.timestamp
            });

            data["eventData"] = eventData;
            return data;
        })
};

function checkAccess(data, exclusions) {
    for (var i = 0; i < exclusions.length; i++) {
        if (data == exclusions[i]) {
            return false;
        }
    }
    return true
}

async function getObjectData(obj) {
    return service.find(getTypeFromObj(obj), "id", getNameFromObj(obj)).then(d => {
        return d.data[0];
    })
}

async function getEventData(qualifiedId) {
    var eventData = [];

    return service.find("/EventData", "entity", qualifiedId).then(d => {
        for (var i = 0; i < Object.keys(d).length; i++) {
            if (d.data[i] != null) {
                eventData.push(d.data[i]);
            };
        };
        return eventData;
    });
};

var getNameFromObj = function (obj) {
    return obj.split('#').pop().replace('"', '');
}

var getTypeFromObj = function (obj) {
    return obj.split('#').shift().split('.').pop();
}

async function getObjectTree(obj, objectTree) {
    if (objectTree.length == 0) {
        objectTree.push(obj);
    }
    return getObjectData(obj).then(d => {
        if (d.parentContainer != null) {
            objectTree.push(d.parentContainer)
            return getObjectTree(d.parentContainer, objectTree)
        } else {
            return objectTree;
        }
    })
}

//Array sorting function
(function () {
    if (typeof Object.defineProperty === 'function') {
        try {
            Object.defineProperty(Array.prototype, 'sortBy', {
                value: sb
            });
        } catch (e) {}
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();

service.getData9Mile('product-1');