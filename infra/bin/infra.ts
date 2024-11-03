#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/lambda-stack';
import { RepositoryStack } from '../lib/repository-stack';

const account = '211125782845';
const region = 'eu-west-1';
const ecrRepoName = 'rust-lambda-sample';

const app = new cdk.App();

new RepositoryStack(app, 'rust-lambda-repo-stack', {
  env: {
    account: account,
    region: region,
  },
  repositoryName: ecrRepoName,
});

new InfraStack(app, 'rust-lambda-sample-app-stack', {
  env: {
    account: account,
    region: region,
  },
  repositoryName: ecrRepoName,
});

app.synth();
