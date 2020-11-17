module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    var responseMessage = ''

    const money = req.body.money
    console.log('money is ', money)
    const tax = 0.1
        if(req.body.money == null){
            console.log('error in the Json input')
            responseMessage = 'no amount of taxes could be cauclated due to wrong input'
            context.res ={
                status: 404,
                body: responseMessage
        }   }
        else{
            var amountToBePaid = money*tax
            responseMessage = `the amount of taxes to pay is ${amountToBePaid}`
            context.res= {
                status: 200,
                body: {"Message":responseMessage, "AmountToBePaid":amountToBePaid}

                }

        }
}
