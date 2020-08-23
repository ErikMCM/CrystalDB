const fs = require("fs");

exports.initialize = function () {
    var baseDir = './crystaldb';
    var dir = './crystaldb/crystaldbmain';
    var dir2 = './crystaldb/crystaldbbackup';

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

exports.get = function (file) {
    var fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
    var fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";

    if (!fs.existsSync(fileLocation)) {
        if (!fs.existsSync(fileLocation2)) {
            return Promise.reject(new Error(`File "${file.toString()}" does not exist!`));
        };
    };

    if (fs.existsSync(fileLocation)) {
        if (!fs.existsSync(fileLocation2)) {
            fs.copyFile(fileLocation, fileLocation2, (err) => {
                if (err) { console.log("There was a copy error: " + err); return; }
                if (!err) { console.log('File has been found in main, but not backup. Automatically copied it to the "crystaldbbackup" directory. (./crystaldb/crystaldbbackup/)'); }
            });
        };
        const readFileBase = fs.readFileSync(fileLocation);
        return Promise.resolve(JSON.parse(readFileBase));
    };

    if (!fs.existsSync(fileLocation)) {
        if (fs.existsSync(fileLocation2)) {
            fs.copyFile(fileLocation2, fileLocation, (err) => {
                if (err) { console.log("There was a copy error: " + err); return; }
                if (!err) { console.log('File has been found in the backup. Automatically copied it to the "crystaldbmain" directory. (./crystaldb/crystaldbmain/)'); }
            });
        };
    };

    if (fs.existsSync(fileLocation)) {
        const readFileBackup = fs.readFileSync(fileLocation2, { encoding: "utf-8" });

        return Promise.resolve(JSON.parse(readFileBackup));
    } else { return Promise.reject(new Error(`File ${file.toString()} does not exist!`)); };
}

exports.write = function (file, newData) {
    var fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
    var fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";

    var checker = file.toString();
    
    if (checker.length <= 0 || checker.length > 140) {
        return console.error("Too long of a file ID! Your file ID needs to be from 1-140.");
    };

    if (!fs.existsSync(fileLocation)) {
        if (fs.existsSync(fileLocation2)) {
            fs.copyFile(fileLocation2, fileLocation, (err) => {
                if (err) { console.log("There was a copy error: " + err) };
                return;
            });

            console.log('File has been found in the backup. Automatically copied it to the "crystaldbmain" directory. (./crystaldb/crystaldbmain/)');
        }
    };

    if (fs.existsSync(fileLocation)) {
        try {
            var jsonData = fs.readFileSync(fileLocation, { encoding: "utf-8" });
            try {
                var parsed = JSON.parse(jsonData);
            } catch (e) { };
            var objectLol = JSON.parse(newData);

            if (!jsonData) {
                fs.writeFileSync(fileLocation, JSON.stringify(objectLol));
            } else if (jsonData) {
                Object.assign(parsed, objectLol);
                
                fs.writeFileSync(fileLocation, JSON.stringify(parsed));
            };
        } catch (e) {
            if (e) {
                console.log(`There was a write error: ${e}`);
                return;
            };
        };
    };

    if (!fs.existsSync(fileLocation)) {
        if (!fs.existsSync(fileLocation2)) {
            try {
                fs.appendFileSync(fileLocation, newData);

                function copy() {
                    fs.copyFile(fileLocation, fileLocation2, (err) => {
                        if (err) { console.log("There was a copy error: " + err) };
                        return;
                    });
                };

                setTimeout(copy, 2000);
            } catch (e) {
                if (e) {
                    console.log(`There was a write error: ${e}`);
                    return;
                };
            };
        };
    };

    if (!fs.existsSync(fileLocation)) {
        fs.copyFile(fileLocation2, fileLocation, (err) => {
            if (err) { console.log("There was a copy error: " + err) };
            return;
        });

        console.log('File has been found in the backup. Automatically copied it to the "crystaldbmain" directory. (./crystaldb/crystaldbmain/)');
    };

    if (!fs.existsSync(fileLocation2)) {
        fs.copyFile(fileLocation, fileLocation2, (err) => {
            if (err) { console.log("There was a copy error: " + err) };
            return;
        });
    };
}

exports.delete = function (file) {
    function remove() {
        var fileLocation = './crystaldb/crystaldbmain/crystal' + file.toString() + ".json";
        var fileLocation2 = './crystaldb/crystaldbbackup/crystal' + file.toString() + ".json";

        fs.unlinkSync(fileLocation);
        fs.unlinkSync(fileLocation2);
    };

    try {
        setTimeout(remove, 3000);
    } catch (e) {
        if (e) {
            return console.error((`There was a delete error: ${e}`))
        };
    };
}
