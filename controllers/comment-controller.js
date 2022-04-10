const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            // allows you to add a specific comment to a certain pizza based on ID
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    // sets id to the pizza ID of choice
                    { _id: params.pizzaId },
                    // pushes comment to array
                    { $push: { comments: _id } },
                    // will return collection not updated if set to false
                    // when set to true it will return pizza with updated comment
                    { new: true, runValidators: true }
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
        // remove reply
        removeReply({ params }, res) {
            Comment.findOneAndUpdate(
                { _id: params.commentId },
                // removes specific reply, matches replyId in the past route
                { $pull: { replies: { replyId: params.replyId } } },
                { new: true }
            )
                .then(dbPizzaData => res.json(dbPizzaData))
                .catch(err => res.json(err));
        }
};

module.exports = commentController;