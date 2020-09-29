const fs = require("fs");

function checkExistance(fileName) {
    let fileLocation = './crystaldb/crystaldbmain/crystal' + fileName.toString() + ".json";
    let fileLocation2 = './crystaldb/crystaldbbackup/crystal' + fileName.toString() + ".json";

    if (fs.existsSync(fileLocation)) {
        if (fs.existsSync(fileLocation2)) {
            return true;
        };
    };

    if (!fs.existsSync(fileLocation)) {
        if (!fs.existsSync(fileLocation2)) {
            return false
        };
    };

    if (fs.existsSync(fileLocation)) {
        if (!fs.existsSync(fileLocation2)) {
            fs.copyFile(fileLocation, fileLocation2, (err) => {
                if (err) { console.log("There was a copy error: " + err); return; }
                if (!err) { console.log('File has been found in main, but not backup. Automatically copied it to the "crystaldbbackup" directory. (./crystaldb/crystaldbbackup/)'); }
                return true
            });
        };
    };

    if (!fs.existsSync(fileLocation)) {
        if (fs.existsSync(fileLocation2)) {
            fs.copyFile(fileLocation2, fileLocation, (err) => {
                if (err) { console.log("There was a copy error: " + err); return; }
                if (!err) { console.log('File has been found in the backup. Automatically copied it to the "crystaldbmain" directory. (./crystaldb/crystaldbmain/)'); }
                return true
            });
        };
    };
};

function parseFile(fileName) {
    let fileLocation = './crystaldb/crystaldbmain/crystal' + fileName.toString() + ".json";
    const parsedJSON = JSON.parse(fs.readFileSync(fileLocation, { encoding: "utf-8" }))

    return parsedJSON;
}

exports.initialize = function () {
    let baseDir = './crystaldb';
    let dir = './crystaldb/crystaldbmain';
    let dir2 = './crystaldb/crystaldbbackup';

    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
        fs.mkdirSync(dir);
        fs.mkdirSync(dir2);
    };

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    };

    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    };
}

//Get Function
exports.get = function (file) {
    let isExistant = checkExistance(file)

    //Checks if File is Existant (function returns true or false)
    if (isExistant == true) {
        let parsedJSON = parseFile(file)

        return Promise.resolve(parsedJSON)
    } else if (isExistant == false) {
        return Promise.reject(new Error(`File ${file.toString()} does not exist!`));
    }
}

//Fetch Function
exports.fetch = function (file, variable) {
    let isExistant = checkExistance(file)

    //Checks if File is Existant (function returns true or false)
    if (isExistant == true) {
        let parsedJSON = parseFile(file)

        if (!parsedJSON[variable]) {
            return Promise.reject(new Error(`Variable ${variable} does not exist in file ${file.toString()}!`));
        }
        return Promise.resolve(parsedJSON[variable])
    } else if (isExistant == false) {
        return Promise.reject(new Error(`File ${file.toString()} does not exist!`));
    }
}

//Grab Function
exports.grab = function (file, variable) {
    let isExistant = checkExistance(file)

    if (isExistant == true) {
        let parsedJSON = parseFile(file)

        if (!parsedJSON[variable]) {
            return new Error(`Variable ${variable} does not exist in file ${file.toString()}!`)
        }
        return parsedJSON[variable]
    } else if (isExistant == false) {
        return new Error(`File ${file.toString()} does not exist!`)
    }
}

//Exists Function
exports.exists = function (file, optionalVar) {
    let isExistant = checkExistance(file);

    if (isExistant == true) {
        if (optionalVar) {
            let data = parseFile(file)

            if (data[optionalVar]) {
                return true
            } else {
                return false
            }
        }

        return true
    } else if (isExistant == false) {
        return false
    }
}

//Write Function
exports.write = function (file, newData) {
    let fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
    let fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";

    let checker = file.toString();

    //Checks if file name is too long
    if (checker.length <= 0 || checker.length > 140) {
        return Promise.reject(new Error("Too long of a file ID! Your file ID needs to be from 1-140."))
    };

    //Checks if file includes forbidden characters
    if (checker.includes("<" || ">" || ":" || "/" || "\\" || "|" || "?" || "*" || "\0")) {
        return Promise.reject(new Error("Forbidden character in file name. Please visit https://crystaldb.js.org/forbiddencharacters.html to view the full list of forbidden file naming characters."))
    };

    //Check if file exists
    let isExistant = checkExistance(file)

    if (isExistant == true) {
        //File already exists according to checkExistance(), so we can just add data
        try {
            let parsed = parseFile(file)
            let newJSONData = JSON.parse(newData);

            Object.assign(parsed, newJSONData);

            fs.writeFileSync(fileLocation, JSON.stringify(parsed));
            return Promise.resolve("Successfully written to file.")
        } catch (e) {
            if (e) {
                return Promise.reject(new Error(`There was a write error: ${e}`))
            };
        };
    } else if (isExistant == false) {
        //If the file doesn't exist
        try {
            //Create the file with the data after 2 secs
            fs.appendFileSync(fileLocation, newData);

            function copy() {
                fs.copyFile(fileLocation, fileLocation2, (err) => {
                    if (err) { return Promise.reject(new Error("There was a copy error: " + err)) };
                });
            };

            setTimeout(copy, 2000);
            return Promise.resolve("Successfully written to file.")
        } catch (e) {
            if (e) {
                return Promise.reject(new Error(`There was a write error: ${e}`));
            };
        };
    };
}

exports.delete = function (file) {
    function remove() {
        let isExistant = checkExistance(file)
        if (isExistant == false) {
            return Promise.reject(new Error(`File ${file.toString()} does not exist!`))
        }
        let fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
        let fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";

        fs.unlinkSync(fileLocation);
        fs.unlinkSync(fileLocation2);
    };

    try {
        let isExistant = checkExistance(file)
        if (isExistant == false) {
            return Promise.reject(new Error(`File ${file.toString()} does not exist!`))
        } else {
            setTimeout(remove, 3000);
            return Promise.resolve("Successfully deleted the file.")
        }
    } catch (e) {
        if (e) {
            return Promise.resolve(new Error(`There was a delete error: ${e}`))
        };
    };
}