module.exports = {
  apps : [{
    name: "client",
    script: 'npm start'
  }],

  deploy : {
    production : {
      key  : 'deployment.pem',
      user : 'ubuntu',
      host : '54.193.175.148',
      ref  : 'origin/main',
      repo : 'git@github.com:codecallogic/fabworkflows.git',
      path : '/home/ubuntu/client',
      'pre-deploy-local': '',
      'post-deploy' : 'source ~/.nvm/nvm.sh && npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};