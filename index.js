/*
 * Copyright (c) 2020 ErikMCM.
 * Released under the MIT License.
*/

/**
 * @param {string} file - The file ID
 * @param {string} variable - The JSON object you want to have returned
 * @param {string} newData - The new JSON data you want to add to the file
 */


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

/**
 * @description Initializes Database. This only needs to be called once, when your application starts up, before you read/write any data.
 */
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

/**
 * @description Gets data in a promise. You can have an optional object you want returned.
 * @param {string} fileID - The FileID
 * @param {string} object - [OPTIONAL] The object you want returned 
 * @returns {object} Promise with file data, or the object requested
 */
//Get Function
exports.get = function (fileID, object) {
    var variable = null
    if (object) {
        if (object.object) {
            variable = object.object
        } else {
            variable = object
        }
    }
    var file = fileID
    let isExistant;
    let parsedJSON;

    if (!typeof file == "string") { Promise.reject(new Error(`TypeError: Got ${typeof file} expected string`)) }


    isExistant = checkExistance(file)
    if (variable) {
        if (!typeof variable == "string") { Promise.reject(new Error(`TypeError: Got ${typeof variable} expected string`)) }
        if (isExistant == true) {
            parsedJSON = parseFile(file)

            if (!parsedJSON[variable]) { return Promise.reject(new Error(`Variable ${variable} does not exist in file ${file.toString()}!`)) }

            return Promise.resolve(parsedJSON[variable])
        } else {
            return Promise.reject(new Error(`File ${file.toString()} does not exist!`));
        }
    }


    parsedJSON = parseFile(file)
    return Promise.resolve(parsedJSON)
}

/**
 * @deprecated CrystalDB's fetch() function is depricated, and will be fully removed in v1.3.5. The get() function now provides the same purpose if you add in an optional object to return, otherwise, just pur in the File ID to return the data of the document. For more information, please review https://crystaldb.js.org/
 */

//Fetch Function
exports.fetch = function (file, variable) {
    console.warn("CrystalDB's fetch() function is depricated, and will be fully removed in v1.3.5. The get() function now provides the same purpose if you add in an optional object to return, otherwise, just put in the File ID to return the data of the document. For more information, please review https://crystaldb.js.org/")
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

/**
 * @description Gets data in a promise. You can have an optional object you want returned.
 * @param {string} fileID - The FileID
 * @param {string} object - [OPTIONAL] The object you want returned
 * @returns {object} The data, or error, not in a promise. 
 */
//Grab Function
exports.grab = function (fileID, object) {
    var variable = null
    if (object) {
        if (object.object) {
            variable = object.object
        } else {
            variable = object
        }
    }
    var file = fileID
    let isExistant;
    let parsedJSON;
    isExistant = checkExistance(file)
    if (!typeof file == "string") { return }

    if (variable) {
        if (!typeof variable == "string") { return }
        if (isExistant == true) {
            parsedJSON = parseFile(file)

            if (!parsedJSON[variable]) { return new Error(`Variable ${variable} does not exist in file ${file.toString()}!`) }

            return parsedJSON[variable]
        } else {
            return new Error(`File ${file.toString()} does not exist!`);
        }
    }
    parsedJSON = parseFile(file)
    return parsedJSON
}
/**
 * @description Gets data in a promise. You can have an optional object you want returned.
 * @param {string} fileID - The FileID
 * @param {string} object - [OPTIONAL] The object you want returned
 * @returns {boolean} The result. If the file, and the optional object, exists, it returns true. If any don't exist, it returns false.
 */
//Exists Function
exports.exists = function (fileID, object) {
    var variable = null
    if (object) {
        if (object.object) {
            variable = object.object
        } else {
            variable = object
        }
    }
    var file = fileID
    let isExistant = checkExistance(file);

    if (isExistant == true) {
        if (variable) {
            let data = parseFile(file)

            if (data[variable]) {
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

/**
 * @description Writes data to the file
 * @param {string} fileID - The FileID
 * @param {string} newData - The data you want to write to the file
 * @returns {string} If there is an error, it will return it. It's good to have it in there.
 */
//Write Function
exports.write = function (fileID, newData) {
    var file = fileID
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


/**
 * @description Deletes a file or object. If you only pass through the fileID, it will delete the file, if you pass in the object option, it will delete that object in the file.
 * @param {string} fileID - The FileID
 * @param {string} newData - [OPTIONAL] The object you want to delete
 * @returns {string} If there is an error, it will return it. It's good to have it in there.
 */
exports.delete = function (fileID, object) {
    var variable = null
    if (object) {
        if (object.object) {
            variable = object.object
        } else {
            variable = object
        }
    }
    var file = fileID
    let fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
    let fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";
    if (!object) {
        function remove() {
            let isExistant = checkExistance(file)
            if (isExistant == false) {
                return Promise.reject(new Error(`File ${file.toString()} does not exist!`))
            }
            

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
    } else {
        if (checkExistance(file) == false) {
            return Promise.reject(new Error(`File ${file.toString()} does not exist!`))
        }

        let data = parseFile(file)

        if (data[variable]) {
            delete data[variable]

            fs.writeFileSync(fileLocation, JSON.stringify(data));
            return Promise.resolve("Successfully deleted the object.")
        } else {
            return Promise.reject(new Error(`The object ${variable.toString()} does not exist!`))
        }
    }
}