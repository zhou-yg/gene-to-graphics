import client from 'simple-mongo-server/lib/mongoMap/client';

export default {
  install (Vue) {
    const api = {
      sms: client('sms', {
        gene: {
          method: 'POST',
          properties: {
            name: {
              type: 'string',
            },
            leftGeneValue: {
              type: 'number',
            },
            rightGeneValue: {
              type: 'number',
            },
            calType: {
              type: 'number',
            },
            outputType: {
              type: 'number',
            },
          },
        },
        graphics: {
          method: 'POST',
          properties: {
            name: {
              type: 'string',
            },
            showData: {
              type: 'array',
            },
            category: {
              type: 'string'
            },
          },
        },
        trunk: {
          method: 'POST',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      }, {
        host: 'http://mongo.nomiwan.com/'
      }),
    };
    console.log(api);
    Vue.prototype.$api = api;
  },
};
