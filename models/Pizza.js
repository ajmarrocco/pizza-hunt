const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String,
            // validation
            required: 'You need to provide a pizza name!',
            trim: true
        },
        createdBy: {
            type: String,
            // validation
            required: 'You need to provide your name!',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //formats date
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            required: true,
            // allows user not to enter their own size
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
            default: 'Large'
        },
        toppings: [],
        // instructs parent to keep track of children
        comments: [
            {
                type: Schema.Types.ObjectId,
                // tells Pizza model which documents to refer to
                ref: 'Comment'
            }
        ]
    },
    {
        // tells schema that it can use virtuals
        toJSON: {
            virtuals: true,
            getters: true
        },
        // this is an id that Mongoose returns and in this case, we don't need it
        id: false
    }
);

// get total count of comments and replies on retrieval
// creates virtual property `commentCount` with a value of comments.length
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;