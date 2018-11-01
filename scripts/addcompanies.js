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

var companyData = [
    {
        id: "grower-001",
        name: "Grower-Thompson",
        location: "Yarra Valley, VIC"
    },
    {
        id: "grower-002",
        name: "Grower-Ajani",
        location: "Officer, VIC"
    },
    {
        id: "grower-003",
        name: "Grower-Rutherford",
        location: "Goulburn Valley, VIC"
    },
    {
        id: "9-mile",
        name: "9 Mile",
    },
    {
        id: "summer-snow",
        name: "Summer Snow"
    },
    {
        id: "visy",
        name: "Visy"
    },
    {
        id: "blu-logix",
        name: "BLU Logistics"
    },
    {
        id: "woolworths",
        name: "Woolworths"
    }
];

var setOrigin = [
    {
        items: [
            "resource:model.Product#product-1", "resource:model.Product#product-2"
        ],
        container: "resource:model.Container#container-1",
        eventData: {
            id: "ItemsAdded_container-1",
            location: "Aus"
        }
    }
]

var addItems = [
    {
        items: [
            "resource:model.Product#product-1", "resource:model.Product#product-2"
        ],
        container: "resource:model.Container#container-1",
        eventData: {
            id: "ItemsAdded_container-1",
            location: "Aus"
        }
    },

    {
        items: [
            "resource:model.Product#product-3", "resource:model.Product#product-4"
        ],
        container: "resource:model.Container#container-2",
        eventData: {
            id: "ItemsAdded_container-2",
            location: "Aus"
        }
    },

    {
        items: ["resource:model.Container#container-3"],
        container: "resource:model.Container#container-4",
        eventData: {
            id: "ItemsAdded_container-4",
            location: "Aus"
        }
    }

];

var addCartonsToContainer = [
    {
        items: [
            "resource:model.Container#container-1", "resource:model.Container#container-2"
        ],
        container: "resource:model.Container#container-3",
        eventData: {
            id: "ItemsAdded_container-3",
            location: "Aus"
        }
    }
]

var shipmentDataToDistribution = [
    {
        shipment: {
            id: "shipment-1",
            status: "CREATED",
            destination: "Woolworths Distribution Center",
            entity: "resource:model.Container#container-4",
            owner: "resource:model.Company#blu-logix",
            deliverer: "resource:model.Company#blu-logix",
            recipient: "resource:model.Company#woolworths"
        },
        eventData: {
            location: "Aus",
            id: "Shipment:CREATED_shipment-1"
        }
    }
];

var shipmentDataToSupermarket = [
    {
        shipment: {
            id: "shipment-2",
            status: "CREATED",
            destination: "Woolworths Supermarket",
            entity: "resource:model.Container#container-4",
            owner: "resource:model.Company#woolworths",
            deliverer: "resource:model.Company#woolworths",
            recipient: "resource:model.Company#woolworths"
        },
        eventData: {
            location: "Aus",
            id: "Shipment:CREATED_shipment-2"
        }
    }
]

var updateShipmentDataInTransitToDistribution = [
    {
        shipment: "resource:model.Shipment#shipment-1",
        status: "IN_TRANSIT",
        eventData: {
            location: "Aus",
            id: "Shipment:IN_TRANSIT_shipment-1"
        }
    }
];

var updateShipmentDataArrivedToDistribution = [
    {
        shipment: "resource:model.Shipment#shipment-1",
        status: "ARRIVED",
        eventData: {
            location: "Aus",
            id: "Shipment:ARRIVED_shipment-1"
        }
    }
];

var updateShipmentDataInTransitToSupermarket = [
    {
        shipment: "resource:model.Shipment#shipment-2",
        status: "IN_TRANSIT",
        eventData: {
            location: "Aus",
            id: "Shipment:IN_TRANSIT_shipment-2"
        }
    }
];

var updateShipmentDataArrivedToSupermarket = [
    {
        shipment: "resource:model.Shipment#shipment-2",
        status: "ARRIVED",
        eventData: {
            location: "Aus",
            id: "Shipment:ARRIVED_shipment-2"
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

            function () {
                console.log("Deleting Companies");
                return service.deleteAssets("/Company", utils.getValues(companyData, "id"));
            },
            //#####################################################################################################//


            function () {
                console.log("Creating companies");
                return service.createAssets("/Company", companyData, "model.Company");
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