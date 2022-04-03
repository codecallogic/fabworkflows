export {
  activityStatus,
  jobIssueStatus,
  jobIssueCategory
}

const activityStatus = [
  {status: 'auto-schedule'},
  {status: 'estimate'},
  {status: 'confirmed'},
  {status: 'complete'},
  {status: 'canceled'},
  {status: 'in-progress'},
  {status: 'job-on-hold'}
]

const jobIssueStatus = [
  {status: 'urgent'},
  {status: 'open'},
  {status: 'closed'}
]

const jobIssueCategory = [
  {category: 'scratches'},
  {category: 'marks'},
  {category: 'dishwashe'},
  {category: 'other'},
  {category: 'wrong sink'},
  {category: 'material delay'},
]