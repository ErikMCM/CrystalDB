# CrystalDB v1.2.7 Changelog
-Depricated fetch()  
-Added the option to retrieve an object with get()  
-Added the option to retrieve the file with grab()  
-Added the option to delete an object with delete()  

## Suggested Code Updates
-get()'s formatting for returning a foo is get("fileID", {object: "foo"})  
-grab()'s formatting for returning a foo is grab("fileID", {object: "foo"})  
-Remove fetch() and replace it with get()  

## Documentation
Please review the documentation ASAP, to see new code formatting for the database.
https://crystaldb.js.org/
