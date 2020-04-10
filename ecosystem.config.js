module.exports = {
  apps : [{
    name: 'trees',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: '/data1/logs/trees-error.log',
    out_file: '/data1/logs/trees.log',
  }]

};
