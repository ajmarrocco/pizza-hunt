const { Pizza } = require('../models');

const pizzaController = {
  // the functions will go in here as methods
    // get all pizzas
    // GET /api/pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                // the minus sign in front of __v indicates we want to return everything except the __v
                select: '-__v'
            })
            .select('-__v')
            // sorts in descending order
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    
    // get one pizza by id
    // destructured params from req
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // createPizza
    // POST /api/pizzas
    // destructred body from req
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },
    // update pizza by id
    // PUT /api/pizzas/:id
    updatePizza({ params, body }, res) {
        // set third parameter to true because if it will return original document if not
        // Updates and returns as a response through the find one
        // need to add runValidators to true to let it know that it needs to validate info when updating data
        Pizza.findOneAndUpdate({ _id: params.id }, body,  { new: true, runValidators: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete pizza
    // DELETE /api/pizzas/:id
    deletePizza({ params }, res) {
        // Updates and returns as a response through the find one
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;