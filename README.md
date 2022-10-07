# MTProto Mobile

Mobile app-wrapper for MTProto for executing requests to Telegram Core API.

![Screenshot_20221008-000532_Expo Go](https://user-images.githubusercontent.com/59040542/194644928-3ecc6958-36c7-4cd7-a5af-aebe0dc4105f.jpg)

Made with Expo (react-native) and TypeScript. Uses [@mtproto/core](https://mtproto-core.js.org/) in backend.

Features:

- Multisessions
  - Switch between sessions with single tap
- API methods autocompletion
  - Five most similar matches based on embedded tl schema
- Strict types
  - All params are strictly typed and present in form
- Support for recursive constructors and subtypes
- Console logger with info/error support
- Simple switch of api_id and api_hash

## Building

Install all dependencies (`npm i`), generate keystore file and save to credentials.json, build with `npm run build` for Android.