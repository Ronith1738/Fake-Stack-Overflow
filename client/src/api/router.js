import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/routes', // Update the base URL to match your server configuration
});

// All Questions Page
export const getAllQuestions = () => api.get('/question');
export const getAllQuestionsNewest = () => api.get('/question/newest');
export const getAllQuestionsActive = () => api.get('/question/active');
export const getAllQuestionsUnanswered = () => api.get('/question/unanswered');

// Question Answers Page
export const getQuestionById = (questionId) => api.get(`/question/${questionId}`);
export const incrementViewCountById = (questionId) => api.get(`/question/${questionId}/view`);
export const getAllAnswersForQuestion = (questionId) => api.get(`/question/${questionId}/answers`);
export const getAllAnswerIdsForQuestionNewest = (questionId) => api.get(`/question/${questionId}/answers/newest`);
export const getAllTagsForQuestion = (questionId) => api.get(`/question/${questionId}/tags`);

// Create Questions Page
export const createQuestion = (payload) => api.post('/question', payload);

// Post Answer Page
export const postAnswerToQuestion = (questionId, payload) => api.post(`/question/${questionId}/answer`, payload);

// All Tags Page
export const getAllTags = () => api.get('/tags');
export const getTagById = (tagId) => api.get(`/tags/${tagId}`);
export const numberQuestionsWithTag = (tagId) => api.get(`/tags/${tagId}/number`);

// Miscellaneous Answers Getters
export const getAllAnswers = () => api.get('/answers');
export const getAnswerById = (answerId) => api.get(`/answers/${answerId}`);

//Search Questions Page
export const searchByCriteria = (searchString) => api.get(`/search?searchString=${searchString}`);
export const searchByCriteriaNewest = (searchString) => api.get(`/search/newest?searchString=${searchString}`);
export const searchByCriteriaActive = (searchString) => api.get(`/search/active?searchString=${searchString}`);
export const searchByCriteriaUnanswered = (searchString) => api.get(`/search/unanswered?searchString=${searchString}`);

export const increaseQuestionVoteCountAndUserReputationById = (questionId, payload) => api.post(`/question/${questionId}/upvote`, payload);
export const decreaseQuestionVoteCountAndUserReputationById = (questionId, payload) => api.post(`/question/${questionId}/downvote`, payload);
export const increaseAnswerVoteCountAndUserReputationById = (answerId, payload) => api.post(`/answers/${answerId}/upvote`, payload);
export const decreaseAnswerVoteCountAndUserReputationById = (answerId, payload) => api.post(`/answers/${answerId}/downvote`, payload);
export const increaseCommentVoteCountById = (commentId, payload) => api.post(`/comments/${commentId}/upvote`, payload);

export const getAllCommentsForQuestion = (questionId) => api.get(`/question/${questionId}/comments`);
export const getAllCommentIdsForQuestionNewest = (questionId) => api.get(`/question/${questionId}/comments/newest`);
export const getAllCommentsForAnswer = (answerId) => api.get(`/answers/${answerId}/comments`);
export const getAllCommentIdsForAnswerNewest = (answerId) => api.get(`/answers/${answerId}/comments/newest`);

export const postCommentToQuestion = (questionId, payload) => api.post(`/question/${questionId}/comment`, payload);
export const postCommentToAnswer = (answerId, payload) => api.post(`/answers/${answerId}/comment`, payload);

//Create Account
export const createAccount = (payload) => api.post('/account', payload);

//Get Account
export const getAllAccountsEmail = () => api.get('/account/email');

export const matchPassword = (payload) => api.post('/account/password', payload);

//Get PasswordByAccountId
//export const getPasswordByEmail = (questionId) => api.get(`/question/${questionId}`);

export const getCommentById = (commentId) => api.get(`/comment/${commentId}`);

export const getAccountById = (accountId) => api.get(`/account/${accountId}`);


export const getAllQuestionsFromAccount = (accountId) => api.get(`/question/account/${accountId}`);

export const editQuestion = (payload) => api.post('/question/edit', payload);

export const deleteQuestionById = (questionId) => api.get(`/question/delete/${questionId}`);


const apis = {
  getAccountById,
  getAllQuestions,
  getAllQuestionsNewest,
  getAllQuestionsActive,
  getAllQuestionsUnanswered,
  getQuestionById,
  incrementViewCountById, 
  getAllAnswersForQuestion,
  getAllAnswerIdsForQuestionNewest,
  getAllTagsForQuestion,
  createQuestion,
  postAnswerToQuestion,
  getAllTags,
  getTagById,
  numberQuestionsWithTag,
  getAllAnswers,
  getAnswerById,
  searchByCriteria,
  searchByCriteriaNewest,
  searchByCriteriaActive,
  searchByCriteriaUnanswered,
  createAccount,
  getAllAccountsEmail,
  increaseQuestionVoteCountAndUserReputationById,
  decreaseQuestionVoteCountAndUserReputationById,
  increaseAnswerVoteCountAndUserReputationById,
  decreaseAnswerVoteCountAndUserReputationById,
  increaseCommentVoteCountById,
  getAllCommentsForQuestion,
  getAllCommentIdsForQuestionNewest,
  getAllCommentsForAnswer,
  getAllCommentIdsForAnswerNewest,
  postCommentToQuestion,
  postCommentToAnswer,
  getCommentById,
  matchPassword,
  getAllQuestionsFromAccount,
  editQuestion,
  deleteQuestionById,
};

export default apis;

