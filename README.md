# MTProto Mobile

Mobile app with wrapper for MTProto that allows you to make requests to Telegram Core API (mtproto).

![EXPO GO screenshot abobka](https://user-images.githubusercontent.com/59040542/194706440-6ba96569-1b67-4756-8fee-a0bcf910d440.png)

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