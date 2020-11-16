module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    const loanAmount = req.body.loanAmount
    const amountOnAccount = req.body.Amount
    var responseMessage = ''
    console.log('loanAmount should be ', loanAmount)
    console.log('amountOnAccount should be ', amountOnAccount)

        if(loanAmount * 0.75 > amountOnAccount){
            console.log('it was not made')
            responseMessage ='the loan could not be made'
            context.res ={
            status: 403,
            body:responseMessage
        }

        }
        else{
            console.log('it was made')
            responseMessage = 'the loan was succesfully made'
            context.res ={
                status: 200,
                body: responseMessage
            }
        }
    }


