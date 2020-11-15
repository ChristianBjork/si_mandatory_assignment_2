module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const amount = (req.query.amount);
    const amount = (req.body.amount)
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    const newAmount = amount*1.02

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: newAmount
    };
}