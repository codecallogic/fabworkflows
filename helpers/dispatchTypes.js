export const selectCreateType = (type) => {
  if(type === 'job') return 'CREATE_JOB'
  if(type === 'quote') return 'CREATE_QUOTE'
}

export const selectResetType = (type) => {
  if(type === 'job') return 'RESET_JOB'
  if(type === 'quote') return 'RESET_QUOTE'
}

export const selectCreateArrayType = (type) => {
  if(type === 'job') return 'CREATE_JOB_ARRAY_ITEM'
}