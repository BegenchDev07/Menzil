const mongoose = require('mongoose');
const Schema = mongoose.Schema;

NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    filename:{
        type: String,
        required: true
    },
    lang:{
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('News',NewsSchema)