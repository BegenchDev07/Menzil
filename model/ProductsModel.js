const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    filename:[{
        type:String,
        required: true
    }],
    price: {
        type: String,
        required: true
    },
    pieces: {
        type: String,
        required: true
    },
    lang:{
        type: String,
        required: true
    }
    
});
module.exports = mongoose.model('Products',ProductSchema)