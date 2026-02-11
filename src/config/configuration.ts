export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV,
    database: {
        uri: process.env.MONGO_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    cashfree: {
        appId: process.env.CASHFREE_APP_ID,
        secretKey: process.env.CASHFREE_SECRET_KEY,
    },
    frontendUrl: process.env.FRONTEND_URL,

});
