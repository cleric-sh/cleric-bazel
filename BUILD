load("@npm//@bazel/typescript:index.bzl", "ts_config")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "package_json",
    srcs = [
        "package.json",
        "yarn.lock"
    ]
)

ts_config(
    name = "tsconfig_json",
    src = "tsconfig.json"
)