export {
  activityStatus,
  jobIssueStatus,
  jobIssueCategory,
  edges,
  cutouts
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
  {category: 'dishwasher'},
  {category: 'other'},
  {category: 'wrong sink'},
  {category: 'material delay'},
]

const edges = [
  {type: '1/2 bullnose'},
  {type: '1/4 round'},
  {type: '1/4 bevel'},
  {type: '1/4 radius'},
  {type: '1/8 round'},
  {type: '1/8 bevel'},
  {type: 'flat'},
  {type: 'eased'},
  {type: 'bulnose'},
  {type: 'ogee'},
  {type: 'beveled'},
  {type: 'half bullnose'},
  {type: 'knife'},
  {type: 'dupont'},
  {type: 'triple pencil'},
  {type: 'cove'},
]

const cutouts = [
  {type: 'kitchen undermount cutout'},
  {type: 'kitchen drop in'},
  {type: 'vanity undermount'},
  {type: 'vanity drop in'},
  {type: 'cooktop cutout'},
  {type: 'outlet cutout'},
  {type: 'farmhouse sink cutout'},
]