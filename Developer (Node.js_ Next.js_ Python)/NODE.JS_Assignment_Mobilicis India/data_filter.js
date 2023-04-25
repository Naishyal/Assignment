const Books = require("./books");
const { bookValidation } = require("../validation");
const { default: mongoose } = require("mongoose");


// Filtering
module.exports.getFilteredBooks = async (req, res) => {
    try {
        const perPage = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const filter = {};

        // Extract filter parameters and add them to the filter object
        if (req.query.filter) {
            const filterParams = req.query.filter.split(',');
            filterParams.forEach((param) => {
                const [key, value] = param.split(':');
                filter[key] = value;
            });
        }

        // Extract sort parameters and add them to the sort object
        const sortObj = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach((field) => {
                let sortOrder = 1;
                if (field.startsWith('-')) {
                    sortOrder = -1;
                    field = field.substring(1);
                }
                sortObj[field] = sortOrder;
            });
        }

        const books = await Books.find(filter)
            .sort(sortObj)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        const count = await Books.countDocuments(filter);

        res.status(200).json({
            books,
            currentPage: page,
            totalPages: Math.ceil(count / perPage),
            totalBooks: count,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};