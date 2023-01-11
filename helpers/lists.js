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

export const messageType = [
  'text message',
  'email',
]

export const appointmentKeys = [
  {
    key: 'job.account.name',
    title: 'Account Name',
  },
  {
    key: 'job.name',
    title: 'Job Name'
  },
  {
    key: 'title',
    title: 'Name'
  },
  {
    key: 'activity.status',
    title: 'Status'
  },
  {
    key: 'start',
    title: 'Start Date'
  },
  {
    key: 'activity.scheduleTime',
    title: 'Schedule'
  },
  {
    key: 'activity.duration',
    title: 'Duration'
  },
  {
    key: 'activity.assignee',
    title: 'Assignee'
  },
  {
    key: 'job.accountAddress.contact_name',
    title: 'Customer'
  },
  {
    key: 'job.accountAddress.address',
    title: 'Address'
  },
  {
    key: 'job.accountAddress.city',
    title: 'City'
  },
  {
    key: 'job.accountAddress.state',
    title: 'State'
  },
  {
    key: 'job.accountAddress.zip_code',
    title: 'Zip Code'
  }
]

export const activities = [
  'Cutting',
  'Install',
  'Polishing',
  'Template'
]