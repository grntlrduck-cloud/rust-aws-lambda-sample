FROM ghcr.io/cargo-lambda/cargo-lambda as build

WORKDIR lambda

COPY . .

RUN cargo lambda build --release --arm64


FROM public.ecr.aws/lambda/provided:al2023
# cargo lambda builds an executable 'bootstrao' and 'core'
COPY --from=build /lambda/target/lambda/bootstrap/ ./
ENTRYPOINT [ "./bootstrap" ]
