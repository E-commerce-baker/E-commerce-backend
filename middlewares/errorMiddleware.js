module.exports.globalError = (err, req, res, next) => {
    // handle error
    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500

    if (err.message === 'jwt expired') {
        err.message = 'Session expired, please login again';
        err.statusCode = 401;
    }
    if (err.message === "jwt malformed") {
      err.message = "Invalid token, please login again";
      err.statusCode = 401;
    }
    if (
      err.message ===
      "Cannot read properties of undefined (reading 'startsWith')"
    ) {
      err.message = "Bearer token required";
      err.statusCode = 401;
    }
      // eslint-disable-next-line no-unused-expressions
      process.env.NODE_ENV === "development"
        ? sendErrorInDev(err, res)
        : sendErrorInProd(err, res);
}

const sendErrorInDev = (err, res) => {
     res.status(err.statusCode)
        .json({
            err: {
                statusCode: err.statusCode,
                status: err.status,
                message: err.message,
                stack: err.stack
            }
        })
}
const sendErrorInProd = (err, res) => {
     res.status(err.statusCode)
        .json({
            err: {
                status: err.status,
                message: err.message
            }
        })
}