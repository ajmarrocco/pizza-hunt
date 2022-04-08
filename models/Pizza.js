const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        size: {
            type: String,
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
        },
        // this is an id that Mongoose returns and in this case, we don't need it
        id: false
    }
);

// get total count of comments and replies on retrieval
// creates virtual property `commentCount` with a value of comments.length
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;