/*
 * Copyright (C) 2018 BlockBit Technology Solutions. All Rights Reserved.
 */

async function jump() {
    return new Promise(function(resolve) {
        setTimeout(function(){
            resolve("jump");
        }, 1000);
    });
}
async function main() {
    var r = await jump();

    console.log(r);
}

main();