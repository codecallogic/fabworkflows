export const selectCreateType = (type) => {
  if(type === 'job') return 'CREATE_JOB'
  if(type === 'quote') return 'CREATE_JOB'
  if(type === 'account') return 'CREATE_ACCOUNT'
}

export const selectResetType = (type) => {
  if(type === 'job') return 'RESET_JOB'
  if(type === 'quote') return 'RESET_JOB'
  if(type === 'account') return 'RESET_ACCOUNT'
}

export const selectCreateArrayType = (type) => {
  if(type === 'job') return 'CREATE_JOB_ARRAY_ITEM'
  if(type === 'account') return 'CREATE_ACCOUNT_ARRAY_ITEM'
}