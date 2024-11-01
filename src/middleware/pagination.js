module.exports = paginationMW = (data) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};
    result.data = data.slice(startIndex, endIndex);
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < data.length) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    result.total = data.length;
    res.paginationMW = result;
    next();
  };
};
