const { MessageEmbed, splitMessage } = require("discord.js");
const channels = require('../channels.js');

module.exports = {
    name: "starttn",
    aliases: ['tn'],
    description: "Check TN warehouse folders.",
    execute(message) {

        // Imports / Requires
        var dirwatch = require("./DirectoryWatcher.js");
        var tnChannel = globalClient.channels.get(channels.locations.TN);

        // Create a monitor object that will watch a directory
        // and all it's sub-directories (recursive) in this case
        // we'll assume you're on a windows machine with a folder 
        // named "sim" on your c: drive.
        // should work on both linux and windows, update the path
        // to some appropriate test directory of your own.
        // you can monitor only a single folder and none of its child
        // directories by simply changing the recursive parameter to
        // to false
        var tnMonitor = new dirwatch.DirectoryWatcher("Z:\\13A-Processed", true);

        // start the monitor and have it check for updates
        // every half second.
        tnMonitor.start(60000);
        
        // Log to the console when a file is removed
        tnMonitor.on("fileRemoved", function (filePath) {
            tnChannel.send({
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
        tnMonitor.on("folderRemoved", function (folderPath) {
            tnChannel.send({
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
        tnMonitor.on("folderAdded", function (folderPath) {
            tnChannel.send({
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
        tnMonitor.on("fileChanged", function (fileDetail, changes) {
            for (var key in changes) {
                tnChannel.send({
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
        tnMonitor.on("fileAdded", function (fileDetail) {            
            tnChannel.send({
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

        tnChannel.send({
            embed: {
                color: 0x2ecc71,
                title: "Monitoring Tennessee PickTicket Folder!",
                fields: [{
                    name: "Monitoring mapped drive below!:",
                    value: tnMonitor.root
                }
                ],
                timestamp: new Date(),
                footer: {
                    text: "Current Time Status"
                }
            }
        });
        // Let us know that directory monitoring is happening and where.
        console.log("Directory Monitoring of " + tnMonitor.root + " has started");

    }
};


