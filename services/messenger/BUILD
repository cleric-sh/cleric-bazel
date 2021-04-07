load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")

filegroup(
    name = "config",
    srcs = [
        "//:package_json",
        "//:tsconfig_json"
    ],
)

filegroup(
    name = "sources",
    
)

RUNTIME_DEPS = [
    "@npm//@google-cloud/storage",
    "@npm//puppeteer",
    "@npm//body-parser",        
    "@npm//express",
    "@npm//rimraf",
    "@npm//tar"
]

TYPES = [        
        "@npm//@types/body-parser",        
        "@npm//@types/express",        
        "@npm//@types/node",        
        "@npm//@types/rimraf",        
        "@npm//@types/tar"
    ]

ts_library(
    name = "messenger",
    srcs = glob([
        "src/**/*.ts",
    ]),
    module_name = "@cleric/messenger",
    deps = RUNTIME_DEPS + TYPES
)

# bazel run //src:server -- --port=4000
nodejs_binary(
    name = "server",
    data = RUNTIME_DEPS + [
        ":messenger",        
    ],
    entry_point = ":src/index.ts",
)

# bazel build --platforms=@build_bazel_rules_nodejs//toolchains/node:linux_amd64 //src:docker
nodejs_image(
    name = "image",
    base = "//images/chrome",
    binary = ":server",
    env = {
        "PORT": "3000"
    },
    ports = [
        "3000:3000"
    ],
    # rules_nodejs's node linker has problems when running under a non-root user.
    # https://github.com/bazelbuild/rules_docker/issues/1591
    # https://github.com/bazelbuild/rules_nodejs/issues/2223
    # 
    # These args disable it.
    args = [
        "--nobazel_run_linker",
        "--nobazel_node_patches",
    ]    
)