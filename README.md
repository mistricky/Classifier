# Classifier

Application management software on Mac OS.

## Motivation

- Have a lot of software but it's hard to manage it
- The Dock is too small
- Yeah, I know it's kind of like a folder:laughing:, but i want it！

## Feature

- [ ] Modify user information
- [ ] Delete application

## Usage

Create auth under the `src/configs` for set information of user.

Example :

```typescript
export const USER_INFO = {
  username: "younccat",
  password: "whatever"
};
```

1. Clone project code.

   ```
   git clone https://github.com/HaoDaWang/Classifier
   ```

2. Installation dependence.

   ```
   yarn install
   ```

   Or

   ```
   npm install
   ```

3. Start Classifier.

   ```
   npm run start
   ```

   Or

   ```
   yarn start
   ```

## Platform support

Only Mac OS.

## UI

![login](https://github.com/HaoDaWang/Classifier/blob/master/doc/login.png)

![main](https://github.com/HaoDaWang/Classifier/blob/master/doc/main.png)
