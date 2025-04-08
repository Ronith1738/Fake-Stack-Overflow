const express = require('express');
const router = express.Router();
const QuestionsController = require('../controllers/questions_controller.js')
const AccountsController = require('../controllers/accounts_controller.js')

// All Questions Page
router.get('/question', QuestionsController.getAllQuestions)
router.get('/question/newest', QuestionsController.sortNewest);
router.get('/question/active', QuestionsController.sortActive)
router.get('/question/unanswered', QuestionsController.sortUnanswered)

// Question Answers Page
router.get('/question/:questionId', QuestionsController.getQuestionById); // New route for getting question by ID
router.get('/question/:questionId/view', QuestionsController.incrementViewCountById); // New route for incrementing view count
router.post('/question/:questionId/upvote', QuestionsController.increaseQuestionVoteCountAndUserReputationById);
router.post('/question/:questionId/downvote', QuestionsController.decreaseQuestionVoteCountAndUserReputationById);
router.post('/answers/:answerId/upvote', QuestionsController.increaseAnswerVoteCountAndUserReputationById)
router.post('/answers/:answerId/downvote', QuestionsController.decreaseAnswerVoteCountAndUserReputationById)
router.post('/comments/:commentId/upvote', QuestionsController.increaseCommentVoteCountById)

router.get('/question/:questionId/answers', QuestionsController.getAllAnswersForQuestion);
router.get('/question/:questionId/answers/newest', QuestionsController.getAllAnswerIdsForQuestionSortNewest);
router.get('/question/:questionId/tags', QuestionsController.getAllTagsForQuestion); // New route for getting all tags for a question
router.get('/question/:questionId/comments', QuestionsController.getAllCommentsForQuestion);
router.get('/question/:questionId/comments/newest', QuestionsController.getAllCommentIdsForQuestionSortNewest);
router.get('/answers/:answerId/comments', QuestionsController.getAllCommentsForAnswer);
router.get('/answers/:answerId/comments/newest', QuestionsController.getAllCommentIdsForAnswerSortNewest);

// Create Questions Page
router.post('/question', QuestionsController.createQuestion)

// Post Answer Page
router.post('/question/:questionId/answer', QuestionsController.postAnswerToQuestion);
router.post('/question/:questionId/comment', QuestionsController.postCommentToQuestion);
router.post('/answers/:answerId/comment', QuestionsController.postCommentToAnswer);
// postCommentToQuestion, //Not done yet Logged in and rep > 50
// postCommentToAnswer, //Not done yet Logged in and rep > 50

// All Tags Page
router.get('/tags', QuestionsController.getAllTags); // New route for getting all tags
router.get('/tags/:tagId', QuestionsController.getTagById); // New route for getting tag by ID
router.get('/tags/:tagId/number', QuestionsController.numberQuestionsWithTag);

// Miscellaneous Answers Getters
router.get('/answers', QuestionsController.getAllAnswers)
router.get('/answers/:answerId', QuestionsController.getAnswerById);

//Search Questions Page
router.get('/search', QuestionsController.searchByCriteria);
router.get('/search/newest', QuestionsController.searchByCriteriaSortNewest);
router.get('/search/active', QuestionsController.searchByCriteriaSortActive);
router.get('/search/unanswered', QuestionsController.searchByCriteriaSortUnanswered);

router.get('/comment/:commentId', QuestionsController.getCommentById); // New route for getting question by ID

// Create Account Page
router.post('/account', AccountsController.createAccount)

// Get Accounts Emails
router.get('/account/email', AccountsController.getAllAccountsEmail)

router.post('/account/password', AccountsController.matchPassword)

router.get('/account/:accountId', AccountsController.getAccountById);

router.get('/question/account/:accountId', QuestionsController.getAllQuestionsFromAccount);
router.post('/question/edit', QuestionsController.editQuestion);
router.get('/question/delete/:questionId', QuestionsController.deleteQuestionById);

module.exports = router;
