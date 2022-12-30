export const removeCircularObject = (data, type) => {

  if(type == 'jobIssues'){
    data[type].forEach((item, idx) => {
      delete item.job.jobIssues
    })
  }
  
}