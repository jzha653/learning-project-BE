#!/usr/bin/env bash
gcloud functions deploy app \
--trigger-http \
--runtime=nodejs14 \
--allow-unauthenticated \
--project civic-matrix-327921 \
--entry-point app

