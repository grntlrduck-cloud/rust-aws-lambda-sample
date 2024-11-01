import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  Billing,
  Capacity,
  TableEncryptionV2,
  TableV2,
} from 'aws-cdk-lib/aws-dynamodb';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Architecture, Code, Handler, Function as LFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';

export interface LambdaStackProps extends StackProps {
  readonly repositoryName: string;
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const lambdaDockerImageTag = process.env.DOCKER_TAG ?? 'latest';
    const repo = Repository.fromRepositoryName(this, 'Repo', props.repositoryName);

    /*
     const dynamoTable = new TableV2(this, 'MessageTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(5),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 10 }),
      }),
      encryption: TableEncryptionV2.awsManagedKey(),
    });
    */

    new LFunction(this, 'RustLambda', {
      runtime: Runtime.FROM_IMAGE,
      architecture: Architecture.ARM_64,
      code: Code.fromEcrImage(repo, {
        tag: lambdaDockerImageTag,
      }),
      handler: Handler.FROM_IMAGE,
      logRetention: RetentionDays.ONE_DAY,
    });

    // dynamoTable.grantReadWriteData(rustLambda);
  }
}
