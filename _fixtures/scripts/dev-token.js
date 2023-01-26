const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(path.join(__dirname, 'dev.key'));

const scopes = [
  'read:use_case',
  'create:use_case',
  'update:use_case',
  'delete:use_case',
  'update:use_case_form_initial_information',
  // 'update:use_case_form_feasibility_check',
  'update:use_case_form_details',
  // 'update:use_case_form_hardware_details',
  'update:use_case_form_ordering',
  // 'update:use_case_status',
  'read:file',
  'create:file',
  'update:file',
  'delete:file',
];

const token = jwt.sign({
  sub: '320960ec-37a2-4fd0-af89-0a0a164fdd6b',
  iat: Math.floor(Date.now() / 1000),
  scope: scopes.join(' '),
  role: 'requestor'
}, publicKey, { algorithm: 'HS256' });

console.log(token);

