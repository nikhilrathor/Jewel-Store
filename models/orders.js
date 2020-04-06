var mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({
    user: {
        type: String,
    },
    orderdetails: [{
        image: {
            type: String,
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        required: true
    }
});

var Order = module.exports = mongoose.model('Order', OrderSchema);