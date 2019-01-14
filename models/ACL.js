var mongoose = require('mongoose');

var ACLSchema = new mongoose.Schema({
    projectname: String,
    projectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    method: [{
        type: String,
        lowercase: true,
        enum: ["get", "post", "delete", "put"]
    }],
    projecturl: {
        type: String
    },
    hasAccess: {
        type: Boolean,
    }
}, {
    timestamps: true
});


mongoose.model('ACL', ACLSchema);