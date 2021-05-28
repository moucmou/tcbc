const getOpenId = require('./getOpenId')
const getMiniProgramCode = require('./getMiniProgramCode')
const createCollection = require('./createCollection')
const selectRecord = require('./selectRecord')
const updateRecord = require('./updateRecord')
const sumRecord = require('./sumRecord')


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context)
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context)
    case 'createCollection':
      return await createCollection.main(event, context)
    case 'selectRecord':
      return await selectRecord.main(event, context)
    case 'updateRecord':
      return await updateRecord.main(event, context)
    case 'sumRecord':
      return await sumRecord.main(event, context)
  }
}
