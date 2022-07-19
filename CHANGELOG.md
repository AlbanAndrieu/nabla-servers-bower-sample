# Changelog

<!-- markdown-link-check-disable -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Table of contents

// spell-checker:disable

<!-- toc -->

  * [Size 🌈](#size-%F0%9F%8C%88)
- [[Unreleased]](#unreleased)
- [[O.0.3] - TODO](#o03---todo)
- [[0.0.2] - 2022-25-04](#002---2022-25-04)
  * [Updated](#updated)
- [[0.1.0] - 2022-13-04](#010---2022-13-04)
  * [Added](#added)
  * [Updated](#updated-1)
  * [Remove](#remove)

<!-- tocstop -->

// spell-checker:enable

### Size 🌈

// cSpell:words pgclient jusmundi

## [Unreleased]

<!--lint disable no-undefined-references-->

## [O.0.3] - TODO

## [0.0.2] - 2022-25-04

Ubuntu 22.04

### Updated

- Ubuntu 22.04

`docker pull jusmundi/nabla-servers-bower-sample:0.1.0`

## [0.1.0] - 2022-13-04

Ubuntu 20.04

`docker pull jusmundi/nabla-servers-bower-sample:0.0.1`

### Added

- Add postgresql-client-10 postgresql-client-12 postgresql-client-14
- Add upload tooling swift and s3cmd

### Updated

- None

### Remove

// cSpell:words pgclient
- None

`docker run -it -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v /var/run/docker.sock:/var/run/docker.sock --entrypoint /bin/bash nabla/nabla-servers-bower-sample:0.1.0`

<!-- markdown-link-check-enable -->
