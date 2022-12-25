class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryObj = { ...this.queryStr };
    ['sort', 'page', 'limit', 'fields'].map((el) => delete queryObj[el]);

    queryObj = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gt)|(gte)|(lt)|(lte)\b/g,
        (match) => `$${match}`
      )
    );

    ['fname', 'lname'].map((el) => {
      queryObj[el] && (queryObj[el] = new RegExp(`^${queryObj[el]}`, 'i'));
    });

    this.query = this.query.find(queryObj);
    return this;
  }
}

module.exports = APIFeatures;
