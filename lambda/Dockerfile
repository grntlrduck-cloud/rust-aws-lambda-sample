FROM ghcr.io/cargo-lambda/cargo-lambda as build

WORKDIR lambda

COPY . .

RUN cargo lambda build --release --arm64


FROM public.ecr.aws/lambda/provided:al2

COPY --from=build /lambda/target/lambda/bootstrap ./bootstrap

ENTRYPOINT [ "./bootstrap" ]
