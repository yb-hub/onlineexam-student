/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
const BASE_URL = 'http://www.lovecoding.online:8088/api/student'
// const BASE_URL = process.env.BASE_API
const BASE_URL2 = 'http://localhost:8008/student'
/*
  获取轮播图片数据
 */
export const reqRotationImages = () => ajax(BASE_URL + '/getRotationImages')
/*
  校验学生登录
 */
export const reqLogin = ({sno, stuPsw}) => ajax(BASE_URL + '/checkStudentLogin', {sno, stuPsw}, 'POST')
/*
  请求登出
 */
export const reqLogout = () => ajax(BASE_URL + '/studentLoginOut')
/*
  密码修改
 */
export const reqPswChange = ({sno, password, newPassword, newPasswordConfirm}) => ajax(
  BASE_URL + '/studentPswChange',{sno, password, newPassword, newPasswordConfirm},'POST'
)
/*
  用户信息修改
 */
export const reqInfoChange = (formData) => ajax(
  BASE_URL + '/studentInfoChange',formData,'POST'
)
/*
  学生用户注册
 */
export const reqRegister = ({newSno, newPsw, newPswConfirm, newName, newEmail, newPhone, newSecurityCode, newSecurityCodeConfirm}) => ajax(
  BASE_URL + '/studentRegister',{newSno, newPsw, newPswConfirm, newName, newEmail, newPhone, newSecurityCode, newSecurityCodeConfirm},'POST'
)
/*
  学生找回密码
 */
export const reqFindPsw = ({findSno, findPhone, findSecurityCode, findNewPsw, findNewPswConfirm}) => ajax(
  BASE_URL + '/studentFindPsw',{findSno, findPhone, findSecurityCode, findNewPsw, findNewPswConfirm},'POST'
)
/*
  学生反馈留言
 */
export const reqSendFeedback = ({sno, feedback}) => ajax(BASE_URL + '/studentSendFeedback',{sno, feedback},'POST')
/*
  我的页面顶部右侧管理员回复消息提醒数目
 */
export const reqUnreadMsgCount = (sno) => ajax(BASE_URL + '/adminReplyCount', { sno })
/*
  更新反馈信息状态为学生端已读取
 */
export const reqUpdateFeedbackStatus = ({sno}) => ajax(BASE_URL + '/updateFeedbackStatus', {sno})
/*
  学生个人页面反馈信息，包括留言与回复
 */
export const reqFeedbackInfo = (sno) => ajax(BASE_URL + '/getFeedbackInfo', { sno })
/*
  获取考试日历列表数据
 */
export const reqExamCalendar = () => ajax(BASE_URL + '/getExamCalendar')
/*
  获取首页编程语言信息数据
 */
export const reqLanguagesInfo = () => ajax(BASE_URL + '/getLanguagesInfo')
/*
  通过langId获取编程语言信息
 */
export const reqLanguageInfoById = ({langId}) => ajax(BASE_URL + '/getLanguageInfoById',{langId})
/*
  通过langId获取试卷信息
 */
export const reqPapersInfo = ({langId}) => ajax(BASE_URL + '/getPapersInfo',{langId})
/*
  通过paperId获取试卷信息
 */
export const reqPapersInfoByPaperId = ({paperId}) => ajax(BASE_URL + '/getPapersInfoByPaperId',{paperId})
/*
  插入学生成绩表成绩信息，包含三个字段，考试开始时间、学号和试卷id，考试开始时间在后台插入
 */
export const reqInsertStudentPaperScore = ({sno, paperId}) => ajax(BASE_URL + '/insertStudentPaperScore',{sno, paperId},'POST')
/*
  插入学生成绩表成绩信息和学生试卷答题记录信息
 */
export const reqSubmitPaper = ({sno, paperId, singleAnswers, multipleAnswers, judgeAnswers, fillAnswers, timeUsed}) => ajax(
  BASE_URL + '/submitPaper',{sno, paperId, singleAnswers, multipleAnswers, judgeAnswers, fillAnswers, timeUsed},'POST')
/*
  请求获取当前试卷状态，即是否已完成
 */
export const reqCurrentPaperStatus = ({sno, paperId}) => ajax(BASE_URL + '/getCurrentPaperStatus',{sno, paperId},'POST')
/*
  请求获取学生全部试卷成绩信息
 */
export const reqPaperScoreInfo = ({sno}) => ajax(BASE_URL + '/getPaperScoreInfo',{sno})
/*
  请求获取当前试卷的成绩报告
 */
export const reqScoreReport = ({sno, paperId}) => ajax(BASE_URL + '/getScoreReport',{sno, paperId})
/*
  请求根据关键字获取试卷列表
 */
export const reqSearchPapers = ({keyword}) => ajax(BASE_URL + '/getSearchPapers',{keyword})
/*
  获取错题页面触摸滑动全部编程语言信息
*/
export const reqWrongLanguagesInfo = () => ajax(BASE_URL + '/getWrongLanguagesInfo')
/*
  获取错题页面全部错题试卷
*/
export const reqWrongAllPapers = ({sno}) => ajax(BASE_URL + '/getWrongAllPapers',{sno})
/*
  通过langId获取错题页面错题试卷
*/
export const reqWrongPapersByLangId = (sno, langId) => ajax(BASE_URL + '/getWrongPapersByLangId',{sno, langId})
/*
  通过sno和paperId获取错题试卷信息
 */
export const reqPapersInfoByWrongPaperId = ({sno, paperId}) => ajax(BASE_URL + '/getPapersInfoByWrongPaperId',{sno, paperId})
/*
  请求根据answerId更新学生试卷答案表isCollect字段
 */
export const reqUpdatePaperAnswerIsCollect = (answerId, isCollect) => ajax(BASE_URL + '/updatePaperAnswerIsCollect',{answerId, isCollect}, 'POST')
/*
  获取全部收藏题目
*/
export const reqAllCollections = ({sno}) => ajax(BASE_URL + '/getAllCollections',{sno})
/*
  通过题目类型id获取收藏题目
*/
export const reqCollectionsById = (sno, queType) => ajax(BASE_URL + '/getCollectionsById',{sno, queType})
/*
  通过answerId获取收藏单选题目详情
 */
export const reqSingleByAnswerId = ({answerId}) => ajax(BASE_URL + '/getSingleByAnswerId', {answerId})
/*
  通过answerId获取收藏多选题目详情
 */
export const reqMultipleByAnswerId = ({answerId}) => ajax(BASE_URL + '/getMultipleByAnswerId', {answerId})
/*
  通过answerId获取收藏判断题目详情
 */
export const reqJudgeByAnswerId = ({answerId}) => ajax(BASE_URL + '/getJudgeByAnswerId', {answerId})
/*
  通过answerId获取收藏填空题目详情
 */
export const reqFillByAnswerId = ({answerId}) => ajax(BASE_URL + '/getFillByAnswerId', {answerId})

//获取首页课程列表
export const getCourseList = () => ajax(BASE_URL2 + '/courses')

//获取考试练习页列表（课程名称，练习试卷列表）
export const getPaperByCourseId = (id) => ajax(BASE_URL2 + '/paper/course/' + id)

//通过试卷id获取试卷详情信息
export const getPaperDetailByPaperId = (id) => ajax(BASE_URL2 + '/paper/detail/' + id)

//将考生试卷提交到后台
export const insertPaperResult = (submittedPaper) => ajax(BASE_URL2 + '/paper/result', submittedPaper,'POST')

//获取考生的成绩单列表
export const getPaperScoreByStuId = (studentId) => ajax(BASE_URL2 + '/profile/stuScore/'+studentId)

//获取考生的成绩单详情
export const getPaperScoreDetailByExamResultId = (examResultId) => ajax(BASE_URL2 + '/profile/stuScore/detail/' + examResultId)

//获取考生的考试记录（错题）
export const getPaperWrongByStudentId = (studentId) => ajax(BASE_URL2 + '/paper/wrong/'+studentId)

//获取考生的考试记录（通过课程id筛选）
export const getWrongPapersByCourseId = (studentId,courseId) => ajax(BASE_URL2 + '/paper/wrong/'+studentId,{"courseId":courseId})

//获取考生的考试记录的课程
export const getWrongCourse = (studentId) => ajax(BASE_URL2 + '/courses/wrong/' + studentId)

//获取考生的考试记录的详情
export const getPaperWrongDetailByExamId = (examId)=> ajax(BASE_URL2 + '/paper/wrong/detail/'+examId)

//收藏或取消收藏试题
export const updateStudentQuestion = (studentId,questionId,isCollect) => ajax(BASE_URL2 + '/question/collect',{"studentId":studentId,"questionId":questionId,"isCollect":isCollect},'PUT')

//获取考生的所有收藏试题
export const getStudentQuestionCollect = (studentId) => ajax(BASE_URL2 + '/question/collect/'+studentId)

//考生登录
export const login = (sno,stuPsw) => ajax(BASE_URL2 + '/login', {'studentId': sno,'password': stuPsw},'POST')

//考生密码修改
export const updatePassword = (studentId,password,newPassword,newPasswordConfirm) => ajax(BASE_URL2 + '/password/'+studentId,{'password':password,'newPassword':newPassword,'newPasswordConfirm':newPasswordConfirm},'PUT')

//修改考生信息
export const updateStudent = (studentId,name,sex,email,phoneNumber) => ajax(BASE_URL2 + '/'+studentId,{'name':name,'sex':sex,'email':email,'phoneNumber':phoneNumber},'PUT')

//考生登出
export const logout = () => ajax(BASE_URL2+'/logout',{},'POST')

//根据考生学号获取考生收藏题目
export const getAllCollectionsByStudentId = (studentId) => ajax(BASE_URL2 + '/question/collect/'+studentId)

//根据考生学号和题目类型获取考生收藏题目
export const getCollectionsByQuestionType = (studentId,questionType) => ajax(BASE_URL2 + '/question/collect/type/'+studentId,{'questionType':questionType})

//根据题目id获取题目
export const getQuestionById = (questionId) => ajax(BASE_URL2 + '/question/'+questionId)

//根据关键字获取试卷
export const queryPaperByKeyword = (keyword) => ajax(BASE_URL2 + '/paper',{keyword})
