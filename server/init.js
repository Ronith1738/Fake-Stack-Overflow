const bcrypt = require('bcrypt');

const [, , mongoUrl, adminUsername, adminPassword] = process.argv;

if (!mongoUrl || !mongoUrl.startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid MongoDB URL as the first argument. The USAGE is: node init.js mongodb://127.0.0.1:27017/fake_so username password');
    return;
}

if (!adminUsername || !adminPassword) {
    console.log('ERROR: You need to provide the admin username and password as arguments. The USAGE is: node init.js mongodb://127.0.0.1:27017/fake_so username password');
    return;
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comment = require('./models/comments')
let Account = require('./models/account')


let mongoose = require('mongoose');
let mongoDB = mongoUrl;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
let comments = [];

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments, votes) {
  answerdetail = {
    text: text,
    ans_by: ans_by,
  };
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (comments != false) answerdetail.comments = comments;
  if (votes != false) answerdetail.votes = votes;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, comments, summary, views, votes) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    summary: summary,
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (comments != false) qstndetail.comments = comments;
  if (views != false) qstndetail.views = views;
  if (votes != false) qstndetail.votes = votes;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function commentCreate(text, comment_by, comment_date_time, votes) {
  commentdetail = {
    text: text,
    comment_by: comment_by,
  };
  if (comment_date_time != false) commentdetail.comment_date_time = comment_date_time;
  if (votes != false) commentdetail.votes = votes;

  let comment = new Comment(commentdetail);
  return comment.save();
}

async function accountCreate(username, email, password, created_date_time, reputation, isAdmin) {
  const secretPassword = await bcrypt.hash(password, 10); 
  accntdetail = {
    username: username,
    email: email,
    secretPassword: secretPassword,
  }
  if (created_date_time != false) accntdetail.created_date_time = created_date_time;
  if (reputation != false) accntdetail.reputation = reputation;
  if (isAdmin != false) accntdetail.isAdmin = isAdmin;

  let accnt = new Account(accntdetail);
  await accnt.save();
  return accnt;
}

const populate = async () => {
  let admin = await accountCreate(adminUsername, 'admin', adminPassword, false, 100000, true);
  console.log('Admin user created:', admin);

  let t1 = await tagCreate('tagone');
  let t2 = await tagCreate('tagtwo');
  let t3 = await tagCreate('tagthree');
  let t4 = await tagCreate('tagfour');
  let t5 = await tagCreate('tagfive');

  let acc1 = await accountCreate("user1", "user1@gmail.com", "password1", Date.now() - 1000000, 100, false)
  let acc2 = await accountCreate("user2", "user2@gmail.com", "password2", false, false, false)
  let acc3 = await accountCreate("user3", "user3@gmail.com", "password3", false, false, false)
  let acc4 = await accountCreate("user4", "user4@gmail.com", "password4", false, false, false)
  let acc5 = await accountCreate("user5", "user5@gmail.com", "password5", false, false, false)
  let acc6 = await accountCreate("user6", "user6@gmail.com", "password6", false, false, false)
  let acc7 = await accountCreate("user7", "user7@gmail.com", "password7", false, false, false)

  let c1 = await commentCreate("This is comment text 1", acc1, Date.now() - 1000000, 30)
  let c2 = await commentCreate("This is comment text 2", acc2, false, 15)
  let c3 = await commentCreate("This is comment text 3", acc3, false, 200)
  let c4 = await commentCreate("This is comment text 4", acc4, false, 2)
  let c5 = await commentCreate("This is comment text 5", acc5, false, 3)
  let c6 = await commentCreate("This is comment text 6", acc6, false, false)
  let c7 = await commentCreate("This is comment text 7", acc7, false, false)

  

  // function answerCreate(text, ans_by, ans_date_time, comments, votes) {
  //   const answerdetail = {
  //     text: text,
  //     ans_by: ans_by,
  //   };
  //   if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  //   if (comments != false) answerdetail.comments = comments;
  //   if (votes != false) answerdetail.votes = votes;
  
  //   let answer = new Answer(answerdetail);
  //   return answer.save();
  // }

  let a1 = await answerCreate('answer 1', acc1, false, [], 20);
  let a2 = await answerCreate('answer 2', acc2, false, [c2, c1, c3, c4], 50);
  let a3 = await answerCreate('answer 3', acc3, false, [c2, c3, c7, c6], 1000);
  let a4 = await answerCreate('answer 4', acc4, false [c1, c5], false);
  let a5 = await answerCreate('answer 5', acc5, false, [c4, c5], false);
  let a6 = await answerCreate('answer 6 (older)', acc6, Date.now() - 720000, [], 20);
  let a7 = await answerCreate('answer 7 (old)', acc7, Date.now() - 36000, [c7], false);
  let a8 = await answerCreate('answer 8 (oldest)', acc7, Date.now() - 1000000, [c6], 3);
  let a9 = await answerCreate('answer 9 (newest)', acc7, false, [c4], false);
  let ahtml = await answerCreate('yes answer at [ans](https://stackoverflow.com/)', acc5, false, [c5], 250);

  await questionCreate('time test 1', 'test text', [t1], [a1], acc1, Date.now() - 36000, [], "summary1", false, false);
  await questionCreate('time test 2', 'test text', [t1], [a1], acc1, Date.now() - 720000, [c1], "summary1", 100, 10);
  await questionCreate('time test 3', 'test text', [t1], [a1], acc1, Date.parse('07 May 2023 12:00:00 GMT'), [c1], "summary1", 100, 10);
  await questionCreate('time test 4', 'test text', [t1], [a1], acc1, Date.parse('01 Jan 2023 12:00:00 GMT'), [c1], "summary1", 100, 10);
  await questionCreate('time test 5', 'test text', [t1], [a1], acc1, Date.parse('01 Jan 2022 12:00:00 GMT'), [c1], "summary1", 100, 10);

  await questionCreate('HTML test', 'Can you see this link? [ask](https://stackoverflow.com/)', [t1], [ahtml], acc1, false, [c2, c1, c3, c4], "summary1", false, false);

  await questionCreate('data test 1', 'data question text 1', [t1, t2], [a1], acc1, false, [c2, c1, c3, c4], "summary1", 100, 10);
  await questionCreate('data test 2', 'data question text 2', [t2, t3], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 3', 'data question text 3', [t3, t1, t4], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 4', 'data question text 4', [t4], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 5', 'data question text 5', [t5], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 6', 'data question text 6', [t1, t2], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 7', 'data question text 7', [t1, t3], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 8', 'data question text 8', [t4], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 9', 'data question text 9', [t5], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 10', 'data question text 10', [t1], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 11', 'data question text 11', [t2], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 12', 'data question text 12', [t3], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 13', 'data question text 13', [t4], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 14', 'data question text 14', [t5], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('data test 15', 'data question text 15', [t1], [a1], acc1, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('noanswer', 'noanswer', [t1], [], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('ansorder', 'ansorder', [t1], [a1, a6, a3, a7, a2], acc3, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('oldestanswer', 'this should have the oldest answer', [t1], [a8], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('olderanswer', 'this should have an older answer', [t1], [a6], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('oldanswer', 'this should have an old answer', [t1], [a7], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('newestanswer', 'this should have the newest answer', [t1], [a9], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
  await questionCreate('check answer order', 'this should show answers in the sorted order', [t1], [a6, a7, a8, a9], acc2, false, [c5, c4, c2, c1], "summary1", 100, 10);
 
  if(db) db.close();
  console.log('done');
}


populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
