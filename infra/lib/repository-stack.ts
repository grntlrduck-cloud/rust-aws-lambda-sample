import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { Repository, TagMutability } from 'aws-cdk-lib/aws-ecr';
import type { Construct } from 'constructs';

export interface RepositoryStackProps extends StackProps {
  readonly repositoryName: string;
}

export class RepositoryStack extends Stack {
  constructor(scrope: Construct, id: string, props: RepositoryStackProps) {
    super(scrope, id, props);
    new Repository(this, 'RustLambdaEcrRepo', {
      repositoryName: props.repositoryName,
      lifecycleRules: [
        {
          maxImageCount: 5,
        },
      ],
      imageScanOnPush: true,
      imageTagMutability: TagMutability.IMMUTABLE,
      emptyOnDelete: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
