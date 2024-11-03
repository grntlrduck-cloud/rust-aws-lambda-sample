use aws_config::BehaviorVersion;
use aws_sdk_dynamodb::{self as dynamodb};
use lambda_runtime::{run, service_fn, tracing, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::env;
use time::{format_description, OffsetDateTime};

#[derive(Deserialize)]
struct Request {
    command: String,
}

#[derive(Serialize, Clone)]
struct Response {
    req_id: String,
    msg: String,
}

#[derive(Serialize, Deserialize)]
struct DynamoMessage {
    pk: String,
    request_id: String,
    command: String,
    received_at: String,
}

async fn function_handler(
    client: &dynamodb::Client,
    event: LambdaEvent<Request>,
) -> Result<Response, Error> {
    let resp = Response {
        req_id: event.context.request_id,
        msg: String::from("command processed"),
    };

    let dt: OffsetDateTime = OffsetDateTime::now_utc();
    let format =
        format_description::parse("[year]-[month]-[day]T[hour]:[minute]:[second]").unwrap();
    let dynamo_message = DynamoMessage {
        pk: resp.req_id.clone(),
        request_id: resp.req_id.clone(),
        command: event.payload.command,
        received_at: dt.format(&format).unwrap(),
    };

    let table_str = env::var("DYNAMO_TABLE_NAME").unwrap();
    let request = client
        .put_item()
        .table_name(table_str)
        .item("pk", dynamodb::types::AttributeValue::S(dynamo_message.pk))
        .item(
            "request_id",
            dynamodb::types::AttributeValue::S(dynamo_message.request_id),
        )
        .item(
            "command",
            dynamodb::types::AttributeValue::S(dynamo_message.command),
        )
        .item(
            "received_at",
            dynamodb::types::AttributeValue::S(dynamo_message.received_at),
        );
    
    let dyn_resp = request.send().await?;
    let attributes = dyn_resp.attributes();
    if attributes.is_some() {
        let pk = attributes.unwrap().get("pk").cloned();
        println!("dynamdb response returned attributes");
        println!("dynam pk = {:?}", pk);
    } else {
        println!("dynamo response is none")
    }
    
    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();
    let config = aws_config::load_defaults(BehaviorVersion::latest()).await;
    let client = dynamodb::Client::new(&config);
    let shared_client = &client;
    run(service_fn(move |event: LambdaEvent<Request>| async move {
        function_handler(&shared_client, event).await
    }))
    .await
}
