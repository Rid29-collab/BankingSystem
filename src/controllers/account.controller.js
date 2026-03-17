const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");

exports.createAccount = async (req,res) => {
    try{
       
        const { accountType,balance } = req.body;

        const existing = await Account.findOne({ user: req.user._id });
        if(existing){
            return res.status(400).json({
                message: "Account already exists"
            });
        }

        const account = await Account.create({
        user: req.user._id,
        bankName: "Riddhi Co-Operative Bank",
        accountNumber: Date.now().toString(),
        accountType,
        balance: balance || 0
    });

    res.status(201).json({
        message:"Account created Successfully",
        account
    });
    }
    catch(err){
          res.status(500).json({message: err.message});
    }
}

exports.getAccount = async (req,res) => {
    try{
         const account = await Account.findOne({ user: req.user._id })
                                      .populate("user","name email");
        if(!account){
            return res.status(400).json({
                message:"Account not found"
            });
        }

        res.json(account);
        console.log(req.body);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

exports.depositMoney = async (req,res) => {
    try{
       const { amount } = req.body;

       if(amount <= 0){
        return res.status(400).json({
            message: "Amount must be greater than 0"
        });
       }
       const account = await Account.findOne({ user: req.user._id });

       if(!account){
        return res.status(404).json({
            message:"Account not found"
        });
       }

       account.balance += amount;

       await account.save();

       await Transaction.create({
          toAccount: account._id,
          amount,
          type: "deposit"
       });

       res.json({
        message: "Deposit successfully",
        balance: account.balance
       });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.withdrawMoney = async (req,res) => {
    try{
         const { amount } = req.body;

         if(amount <= 0){
            return res.status(400).json({
                message:"Amount must be greater than 0"
            });
         }
       
        const account = await Account.findOne({ user: req.user._id });

        if(!account){
            return res.status(400).json({
                message:"Account not found"
            });
        }

        if(account.balance < amount){
            return res.status(400).json({
                message: "Insufficient Balance"
            });
        }

        account.balance -= amount

        await account.save();

        await Transaction.create({
            fromAccount: account._id,
            amount,
            type: "withdraw"
        });

        res.json({
            message: "Withdraw successfully",
            balance: account.balance
        })

    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.transferMoney = async (req,res) => {
    try{
          const { toAccountNumber, amount } = req.body;

           if(amount <= 0){
            return res.status(400).json({
                message:"Amount must be greater than 0"
            });
         }

          const sender = await Account.findOne({user: req.user._id});
          const receiver = await Account.findOne({accountNumber: toAccountNumber});
        
          if(!sender || !receiver){
            return res.status(404).json({
                message:"Account not found"
            });
        }

          if(sender.balance < amount){
            return res.status(400).json({
                message: "Insufficient balance"
            });
          }

          sender.balance -= amount;
          receiver.balance += amount;

          await sender.save();
          await receiver.save();

          await Transaction.create({
            fromAccount: sender._id,
            toAccount: receiver._id,
            amount,
            type: "transfer"
          });

         res.json({
            message: "Transfer Successfully"
         });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getTransactions = async (req,res) => {
    try{
        const account = await Account.findOne({ user: req.user._id });
        console.log("account info: ",account);
     

        const transactions = await Transaction.find({
            $or:[
                 {fromAccount:account._id},
                 {toAccount:account._id}
            ]
        }).sort({ createdAt: -1 }); //sort in desecending (new->old)

        res.json(transactions);
        console.log("Transaction info: ",transactions);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}





// exports.getTransactions = async (req,res) => {
//     try{
//         const account = await Account.findOne({ user: req.user._id });

//         if(!sender || !receiver){
//             return res.status(404).json({
//                 message:"Account not found"
//             });
//         }

//         const transactions = await Transaction.find({
//             $or:[
//                  {fromAccount:account._id},
//                  {toAccount:account._id}
//             ]
//         }).sort({ createdAt: -1 }); //sort in desecending (new->old)

//         res.json(transactions);
//     }
//     catch(err){
//         res.status(500).json({message: err.message});
//     }
// }
