var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    projectname: {
        type: String,
        lowercase: true,
        match: [/^\S*$/]
    },
    api: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Api'
    }],
    acl: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ACL'
    }],
    assignedto: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});


mongoose.model('Project', ProjectSchema);