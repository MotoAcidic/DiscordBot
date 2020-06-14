const { MessageEmbed, splitMessage } = require("discord.js");
const config = require('../config.js');

module.exports = {
    name: "startmd",
    aliases: ['md'],
    description: "Check MD warehouse folders.",
    execute(message) {

        // Imports / Requires
        var dirwatch = require("./DirectoryWatcher.js");
        var mdChannel = globalClient.channels.get(config.locations.MD);

        // Create a monitor object that will watch a directory
        // and all it's sub-directories (recursive) in this case
        // we'll assume you're on a windows machine with a folder 
        // named "sim" on your c: drive.
        // should work on both linux and windows, update the path
        // to some appropriate test directory of your own.
        // you can monitor only a single folder and none of its child
        // directories by simply changing the recursive parameter to
        // to false
        var mdMonitor = new dirwatch.DirectoryWatcher("Z:\\09A-Processed", true);

        // start the monitor and have it check for updates
        // every half second.
        mdMonitor.start(60000);
        
        // Log to the console when a file is removed
        mdMonitor.on("fileRemoved", function (filePath) {
            mdChannel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "PickTicket Deleted",
                    fields: [{
                        name: "PickTicket:",
                        value: filePath
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Current Time"
                    }
                }
            });
            console.log("File Deleted: " + filePath);
        });

        // Log to the console when a folder is removed
        mdMonitor.on("folderRemoved", function (folderPath) {
            mdChannel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "Folder Deleted",
                    fields: [{
                        name: "PickTicket Folder:",
                        value: folderPath
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Current Time"
                    }
                }
            });
            console.log("Folder Removed: " + folderPath);
        });

        // log to the console when a folder is added
        mdMonitor.on("folderAdded", function (folderPath) {
            mdChannel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "Folder Added",
                    fields: [{
                        name: "PickTicket Folder:",
                        value: folderPath
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Current Time"
                    }
                }
            });
            console.log(folderPath);
        });

        // Log to the console when a file is changed.
        mdMonitor.on("fileChanged", function (fileDetail, changes) {
            for (var key in changes) {
                mdChannel.send({
                    embed: {
                        color: 0x2ecc71,
                        title: "File Changed",
                        description: "  + " + key + " changed...",
                        fields: [{
                            name: "    - From: ",
                            value: ((changes[key].baseValue instanceof Date) ? changes[key].baseValue.toISOString() : changes[key].baseValue)
                        },
                        {
                            name: "    - To  : ",
                            value: ((changes[key].comparedValue instanceof Date) ? changes[key].comparedValue.toISOString() : changes[key].comparedValue)
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: "Current Time"
                        }
                    }
                });
                console.log("File Changed: " + fileDetail.fullPath);
                console.log("  + " + key + " changed...");
                console.log("    - From: " + ((changes[key].baseValue instanceof Date) ? changes[key].baseValue.toISOString() : changes[key].baseValue));
                console.log("    - To  : " + ((changes[key].comparedValue instanceof Date) ? changes[key].comparedValue.toISOString() : changes[key].comparedValue));
            }

        });

        // log to the console when a file is added.
        mdMonitor.on("fileAdded", function (fileDetail) {            
            mdChannel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "New PickTicket",
                    fields: [{
                        name: "PickTicket:",
                        value: fileDetail.fullPath
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Current Time Status"
                    }
                }
            });
            console.log("File Added: " + fileDetail.fullPath);
        });

        mdChannel.send({
            embed: {
                color: 0x2ecc71,
                title: "Monitoring Maryland PickTicket Folder!",
                fields: [{
                    name: "Monitoring mapped drive below!:",
                    value: mdMonitor.root
                }
                ],
                timestamp: new Date(),
                footer: {
                    text: "Current Time Status"
                }
            }
        });
        // Let us know that directory monitoring is happening and where.
        console.log("Directory Monitoring of " + mdMonitor.root + " has started");

    }
};


