const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                if (!/^\d{2,3}-\d+$/.test(v)) {
                    this.invalidate('number', "number must be formatted: xx-xxxxxx... or xxx-xxxxx...");
                    return false;
                }
                const total = v.replace('-', '');
                if (total < 8) {
                    this.invalidate('number', "total digits must >= 8");
                    return false;
                }
                return true;
            },
            message: (props) => {
                return ` ${props?.message} ` || `number ${props.value} is invalid`;
            }
        },
        require: true
    }
});

mongoose.set('toJSON', {
    transform: (d, r) => {
        r.id = r._id.toString();
        delete r._id;
        delete r.__v;
    }
})

module.exports = mongoose.model('Person', personSchema); 