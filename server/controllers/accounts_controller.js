const Account = require('../models/account.js');
const bcrypt = require('bcrypt');

async function createAccount(req, res) {
    try {
      const { username, email, password} = req.body;
      const secretPassword = await bcrypt.hash(password, 10); 
      const account = new Account({
        username,
        email,
        secretPassword,
      });
  
      console.log("New Account: ", account);
      
      const savedAccount = await account.save();
      
      res.status(201).json(savedAccount);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create account' });
    }
}
async function matchPassword(req, res){
  try {
    console.log("We are trying to match passwords")
    const {email,password} = req.body;
    const account = await Account.findOne({email});
    let passwordFound = false;
    if(!account){
      return res.status(400).json({error: "Account not found"});
    }
    
    bcrypt.compare(password,account.secretPassword, (error, result) => {
      if (error) {
        
        console.error('Comparison Error:', error);
      } else {
        console.log(result);
        if (result) {
          console.log("Password match: ", result);
          passwordFound = true;
          
        }else{
          console.log("Password doesn't match :(", result);
        }
        res.json({account,passwordFound}); 
      }
    });
   
     
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve accounts passwords' });
  }
    
}

async function getAllAccountsEmail(req, res) {
    try {
      console.log("We are getting all accounts by email")
      const emails = await Account.find({}, 'email');
  
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve accounts emails' });
    }

  }
  async function getAccountById(req, res) {
    // console.log("We are getting answer by ID")
    try {
      console.log("We are getting account by ID")
      const { accountId } = req.params;
      const account = await Account.findById(accountId);
  
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve account' });
    }
  }

  module.exports = {
    createAccount,
    getAllAccountsEmail,
    matchPassword,
    getAccountById
  }