#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/lambda-stack';

const account = '211125782845';
const region = 'eu-west-1';
const app = new cdk.App();
new InfraStack(app, 'rust-lambda-sample-stack', {
  env: {
    account: account,
    region: region,
  },
});
app.synth();
