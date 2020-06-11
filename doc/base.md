const { MessageEmbed, splitMessage } = require("discord.js");
const { MI01A } = require("./config.json");

module.exports = {
    name: "checkMI",
    aliases: ['mi'],
    description: "Check the MI Warehouse pick tickets.",
    execute(message) {

        // Imports / Requires
        var dirwatch = require("./DirectoryWatcher.js");

        // Create a monitor object that will watch a directory
        // and all it's sub-directories (recursive) in this case
        // we'll assume you're on a windows machine with a folder 
        // named "sim" on your c: drive.
        // should work on both linux and windows, update the path
        // to some appropriate test directory of your own.
        // you can monitor only a single folder and none of its child
        // directories by simply changing the recursive parameter to
        // to false
        var miMonitor = new dirwatch.DirectoryWatcher("File Path Here", true);

        // start the monitor and have it check for updates
        // every half second.
        miMonitor.start(500);

        // Log to the console when a file is removed
        miMonitor.on("fileRemoved", function (filePath) {
            console.log("File Deleted: " + filePath);

            message.channel.send({
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
        });

        // Log to the console when a folder is removed
        miMonitor.on("folderRemoved", function (folderPath) {
            console.log("Folder Removed: " + folderPath);

            message.channel.send({
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
        });

        // log to the console when a folder is added
        miMonitor.on("folderAdded", function (folderPath) {
            console.log(folderPath); 

            message.channel.send({
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
        });

        // Log to the console when a file is changed.
        miMonitor.on("fileChanged", function (fileDetail, changes) {
            console.log("File Changed: " + fileDetail.fullPath);
            for (var key in changes) {
                console.log("  + " + key + " changed...");
                console.log("    - From: " + ((changes[key].baseValue instanceof Date) ? changes[key].baseValue.toISOString() : changes[key].baseValue));
                console.log("    - To  : " + ((changes[key].comparedValue instanceof Date) ? changes[key].comparedValue.toISOString() : changes[key].comparedValue));
            }

            for (var key in changes) {
                message.channel.send({
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
            }

        });

        // log to the console when a file is added.
        miMonitor.on("fileAdded", function (fileDetail) {
            console.log("File Added: " + fileDetail.fullPath);

            message.channel.send({
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

        });

        // Let us know that directory monitoring is happening and where.
        console.log("Directory Monitoring of " + miMonitor.root + " has started");

    }
};


