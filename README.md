# mag3llan-sdk

> Mag3llan SDK for NodeJS

## Install

```sh
$ npm install mag3llan-sdk
```

## Usage

```sh
var mag3llan = require('mag3llan-api');

mag3llan.setPreference(userId, itemId, value)
mag3llan.delPreference(userId, itemId)
mag3llan.deleteUser(userId)
var otherUsers = mag3llan.plu(userId)
var otherUsers = mag3llan.pluItemRating(userId, itemId)
var overlaps = mag3llan.overlaps(userId, otherUserId)
var recommendations = mag3llan.recommendations(userId)
var similarity = mag3llan.similarity(userId, otherUserId)
```
