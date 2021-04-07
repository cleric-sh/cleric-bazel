# Bazel workspace created by @bazel/create 3.1.0

# Declares that this directory is the root of a Bazel workspace.
# See https://docs.bazel.build/versions/master/build-ref.html#workspace

workspace(
    # How this workspace would be referenced with absolute labels from another workspace
    name = "cleric",
    # Map the @npm bazel workspace to the node_modules directory.
    # This lets Bazel use the same node_modules as other local tooling.
    managed_directories = {"@npm": ["node_modules"]},
)

# Install the nodejs "bootstrap" package
# This provides the basic tools for running and packaging nodejs programs in Bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "dd4dc46066e2ce034cba0c81aa3e862b27e8e8d95871f567359f7a534cccb666",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.1.0/rules_nodejs-3.1.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

yarn_install(
    # Name this npm so that Bazel Label references look like @npm//package
    name = "npm",
    package_json = "//:package.json",
    # strict_visibility = False,
    # symlink_node_modules = False,
    yarn_lock = "//:yarn.lock",
)

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "95d39fd84ff4474babaf190450ee034d958202043e366b9fc38f438c9e6c3334",
    strip_prefix = "rules_docker-0.16.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.16.0/rules_docker-v0.16.0.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load(
    "@io_bazel_rules_docker//nodejs:image.bzl",
    _nodejs_image_repos = "repositories",
)

_nodejs_image_repos()

load("@io_bazel_rules_docker//contrib:dockerfile_build.bzl", "dockerfile_image")

dockerfile_image(
    name = "base-puppeteer",
    dockerfile = "//svcs/messenger/image:Dockerfile"
)

load("@io_bazel_rules_docker//container:container.bzl", "container_pull")

container_pull(
    name = "node-slim",
    registry = "index.docker.io",
    repository = "node",
    tag = "12-slim",
    digest = "sha256:a48c8c2a605b93774b6ae490c550a25b2f2342107749bee0a49dd24208e7399d"
)