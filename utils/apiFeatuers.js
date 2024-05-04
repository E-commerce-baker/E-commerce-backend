class ApiFeatures {
    constructor(mongoQuery, query) {
        this.mongoQuery = mongoQuery
        this.query = query
    }

    Pagination(documentCount) {
        const page = parseInt(this.query.page, 10) || 1;
        const limit = parseInt(this.query.limit, 10) || 100;
        const skip = (page - 1) * limit;
        this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);
        const pages = Math.ceil(documentCount / limit);
        const next = page < pages ? page + 1 : null;
        const prev = page > 1 ? page - 1 : null;
        this.pagination = {
            total: documentCount,
            page,
            limit,
            pages,
            next,
            prev
        };
        return this;
    }

    sort() {

        if (this.query.sort) {
            const sortstr = this.query.sort.split(',').join(' ');
            this.mongoQuery = this.mongoQuery.sort(sortstr);
        } else {
            this.mongoQuery = this.mongoQuery.sort({ createdAt: -1 });
        }
        return this
    }

    Filter() {

        let filterionObj = { ...this.query };
        const unarr = ['page', 'limit', 'sort', 'fields'];
        unarr.forEach(x => delete filterionObj[x]);

        let queryStr = JSON.stringify(filterionObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        filterionObj = JSON.parse(queryStr);
        this.mongoQuery = this.mongoQuery.find(filterionObj)
        return this
    }

    fields() {

        if (this.query.fields) {
            const fieldObj = this.query.fields.split(',').join(' ');
            this.mongoQuery = this.mongoQuery.select(fieldObj);
        } else {
            this.mongoQuery = this.mongoQuery.select('-__v');
        }
        return this
    }

    search(modelName) {
        
        if (this.query.keyword) {
            if (modelName === 'Product') {
                this.mongoQuery = this.mongoQuery.find({
                    $or: [
                        { title: { $regex: this.query.keyword, $options: 'i' } },
                        { description: { $regex: this.query.keyword, $options: 'i' } }
                    ]
                })
            } else {
                this.mongoQuery = this.mongoQuery.find({ name: { $regex: this.query.keyword, $options: 'i' } })
            }
            return this
        }
        return this
    }
}

module.exports = ApiFeatures