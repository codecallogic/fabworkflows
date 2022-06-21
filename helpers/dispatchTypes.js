export const selectCreateType = (type) => {
  if(type === 'job') return 'CREATE_JOB'
  if(type === 'quote') return 'CREATE_JOB'
  if(type === 'account') return 'CREATE_ACCOUNT'
  if(type === 'purchaseOrderLines') return 'CREATE_PO_LINE'
}

export const selectResetType = (type) => {
  if(type === 'job') return 'RESET_JOB'
  if(type === 'quote') return 'RESET_JOB'
  if(type === 'accountForm') return 'RESET_ACCOUNT'
  if(type === 'purchaseOrderLines') return 'RESET_PO_LINE'
}

export const selectCreateArrayType = (type) => {
  if(type === 'job') return 'CREATE_JOB_ARRAY_ITEM'
  if(type === 'accountForm') return 'CREATE_ACCOUNT_ARRAY_ITEM'
  if(type === 'purchaseOrderForm') return 'CREATE_PO_ARRAY_ITEM'
}