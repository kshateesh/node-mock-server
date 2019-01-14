var mongoose = require('mongoose');

var ApiSchema = new mongoose.Schema({
    apiname: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    qs: mongoose.Schema.Types.Mixed,
    method: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    reqbody: {
        type: mongoose.Schema.Types.Mixed
    },
    resbody: {
        type: mongoose.Schema.Types.Mixed
    },
    header: {
        type: mongoose.Schema.Types.Mixed
    },
    responsestatus: {
        type: Number
    },
    responsebody: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    apiurl: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }
}, {
    timestamps: true
});

mongoose.model('Api', ApiSchema);