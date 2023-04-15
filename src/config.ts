export default {
  "name": "app-name",
  auth: {
    // not sure how many data under auth, this is dynamic setted by develoer
  },
  infos: {
    // this is same as auth
    region: 'cn'
  },
  pages: [
    {
      tag: {
        // this is tag data, all of this tag data are static setted by developer
        // tag data is a picture of page
        name: "this-is-home",
        section: 'footer'
      },
      name:'xxxxxxx',
      meta: {},
      id: '/home',
      trackDynamicData: true,
      rules: {
        // this is rules data, all of this rules data are static setted by developer
        page: {
          pageName: "{name}:{region}",
          section: "{name}:{region}-{section}",
        }
      },
      actions: {
        clicks: [
          {
            tag: {
              buttonName: 'hello-click'
            },
            meta: {
            },
            rules: {
              button: {
                buttonName: "{name}:{region}-{buttonName}:{cardname}"
              }
            },
            dynamicKeys: ['cardname'],
            id: 'domid',
            class: 'domclass',
          }
        ],
        toggle: [
          {
            tag: {},
            id: 'actionid',
          }
        ]
      }
    }
  ]
}