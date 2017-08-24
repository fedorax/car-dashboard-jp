#!/usr/bin/env node
/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// 構成情報の取得
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得します');
  require('dotenv').config({ path: 'local.env' });
} else {
  console.log('環境変数から構成情報を取得します');
}

var server = require('./app');
var port = process.env.VCAP_APP_PORT || 3000;

server.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
  console.log('http://localhost:%d', port);
});
