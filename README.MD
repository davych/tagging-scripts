```json
export default {
  name: 'app-name',
pushTargets: {
    gtm: 'return dataLayer.push({event: eventName, ...data});',
  },
  eventLabel: 'event',
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
        name: 'this-is-home',
        section: 'footer'
      },
      name:'xxxxxxx',
      meta: {},
      id: '/page2',
      event: 'page__view',
      type: 'page',
      dynamicKeys: ['aaa'],
      rules: {
        // this is rules data, all of this rules data are static setted by developer
        page: {
          pageName: '{name}:{region}',
          section: '{name}:{region}-{section}+{aaa}',
        }
      },
      actions: {
        clicks: [
          {
            tag: {
              buttonName: 'hello-click'
            },
            type: 'click',
            event: 'button__click',
            meta: {
            },
            rules: {
              button: {
                buttonName: '{name}:{region}-{buttonName}:{cardname}'
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
            event: 'toggle',
            id: 'domid',
            class: 'domclass',
            type: 'toggle',
          }
        ],
        errors: [
          {
            tag: {},
            event: 'http_error',
            id: 'actionid',
            type: 'http_error',
          },
          {
            tag: {},
            event: 'form_error',
            id: 'domid',
            class: 'domclass',
            type: 'form_error',
          },
        ],
      }
    }
  ]
}
```