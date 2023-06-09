# Tagging Scripts
This is a tools for helping FE developers adding tags to track user journey.

# Example project
[Open here a tutorial project repo](https://github.com/davych/tagging-scripts-tutorial)

[Open here a runtime tutorial project](https://codesandbox.io/p/github/davych/tagging-scripts-tutorial/main?file=%2FREADME.md&workspace=%257B%2522activeFilepath%2522%253A%2522%252FREADME.md%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522spaces%2522%253A%257B%2522clgloljct00kr3b6ksshxoks7%2522%253A%257B%2522devtools%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522start%2522%252C%2522port%2522%253A3000%252C%2522key%2522%253A%2522clglom2ba00qv3b6k7qmt4k18%2522%252C%2522isMinimized%2522%253Afalse%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522start%2522%252C%2522key%2522%253A%2522clglolt3y00m53b6kp1u2gabj%2522%252C%2522isMinimized%2522%253Atrue%257D%255D%252C%2522key%2522%253A%2522clgloljct00kr3b6ksshxoks7%2522%252C%2522name%2522%253A%2522Setup%2522%257D%257D%252C%2522currentSpace%2522%253A%2522clgloljct00kr3b6ksshxoks7%2522%252C%2522spacesOrder%2522%253A%255B%2522clgloljct00kr3b6ksshxoks7%2522%255D%252C%2522hideCodeEditor%2522%253Afalse%257D)

# How to use

## Why we need this tools
Too many tools for tagging, too many ways to add tags, too many ways to track user journey. 

Example for Adobe Analytics, we can use `_satellite.track` to add tags in javascript.

Example for Google Tag Manager, we can use `dataLayer.push` to add tags in javascript.

But all of these ways are not easy to use, and not easy to maintain. Developer need to add tags in many places, most of time developer also need talk with biz team to get the tag data, and then add tags in javascript. 

So assuming we are in a large project, we have many pages, and each page have many actions, and each action have many tags. So we need to add tags in many places, when we have some modification, we need to change many places. 

So this tools is for helping FE developers and biz team to add tags in a easy way.
Biz team can set the tag data in a config file, and FE developers can use this tools to add tags in javascript only need to initialize the config file. Then everything will work.

## How to use

### Install
```
npm install tagging-scripts
```

### Initialize
```
import TaggingScripts from 'tagging-scripts';
import config from './config.js';
TaggingScripts(config);
```

### Config file
Config file is a json file, and it is a picture of all pages and actions in your project.
```javascript
const config = {
  name: 'app-name',
  pushTargets: {
    gtm: 'return dataLayer.push({event: eventName, ...data});',
  },
  eventLabel: 'event',
  auth: {},
  infos: {},
  pages: [
    {
      tag: {},
      name:'home-page',
      id: '/home',
      event: 'page__view',
      type: 'page',
      dynamicKeys: ['from'],
      rules: {},
      actions: {
        clicks: [
          {
            tag: {},
            type: 'click',
            event: 'button__click',
            rules: {},
            dynamicKeys: ['cardid'],
            id: 'dom-id',
            class: 'dom-class',
          }
        ],
      }
    }
  ]
}
```
#### name
The name of your project.

#### pushTargets
This parameter can set different tracking target, it will be used in fire event.
The value is a function statement string. The function will be called when fire event happen.

For example, if we want to add tags to Google Tag Manager, we can set like this: ```'return dataLayer.push({event: eventName, ...data});'```, As we all know ```dataLayer.push``` is a function in Google Tag Manager, so we can set this function statement string as the value of ```pushTargets```. and when we fire event, the function will be called with ```eventName``` and ```data``` as parameters.

#### eventLabel
This parameter is used to set the key name of event when fire event. The default value is ```event```.

#### auth
This parameter is used to set the auth data. The default value is ```{}```. we can update auth by using 
```

import { tagHelpers } from "tagging-scripts";
tagHelpers.updateAuth(auth)
```

#### infos
This parameter is used to set the infos data. The default value is ```{}```. we can update infos by using 
```

import { tagHelpers } from "tagging-scripts";
tagHelpers.updateInfos(infos)
```

#### pages
This parameter is used to set the pages data.

#### pages.tag
This parameter is used to set the tag data of page. The default value is ```{}```.

#### pages.name
This parameter is used to set the name of page. The default value is ```''```.

#### pages.id
This parameter is used to set the id of page. The default value should be the page pathname or hash link.

#### pages.event
This parameter is used to set the event name of page.

#### pages.type
This parameter is used to set the type of page. The default value is ```'page'```.

#### pages.dynamicKeys
This parameter is used to set the dynamic keys of page. The default value is ```[]```.

#### pages.rules
This parameter is used to set the rules of page. The default value is ```{}```.

#### pages.actions
This parameter is used to set the actions of page. The default value is ```{}```.

#### pages.actions.clicks
This parameter is used to set the clicks of page. The default value is ```[]```.

#### pages.actions.clicks.tag
This parameter is used to set the tag data of click. The default value is ```{}```. 

#### pages.actions.clicks.type
This parameter is used to set the type of click. The default value is ```'click'```.

#### pages.actions.clicks.event
This parameter is used to set the event name of click.

#### pages.actions.clicks.rules
This parameter is used to set the rules of click. The default value is ```{}```.  

#### pages.actions.clicks.dynamicKeys
This parameter is used to set the dynamic keys of click. The default value is ```[]```.

#### pages.actions.clicks.id
This parameter is used to set the id of click. The default value should be the id of dom element. 

#### pages.actions.clicks.class
This parameter is used to set the class of click. The default value should be the class of dom element.

## Advanced use cases

### Tracking home page

todo

### Tracking profile page

todo

### Tracking button click

todo
