

load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@io_bazel_rules_docker//docker/util:run.bzl", "container_run_and_commit")

package(default_visibility = ["//visibility:public"])

container_image(
    name = "chrome_installer",    
    base = "@node-slim//image",    
    files = [
        "scripts/install.sh"        
    ]
)

container_run_and_commit(
    name = "chrome_install",
    image = ":chrome_installer.tar",
    commands = [
        "/install.sh"
    ],
)

container_image(
    name = "chrome",
    base = ":chrome_install_commit.tar",
    env = {
        "NODE_OPTIONS": "--max_old_space_size=30000 --max-http-header-size=80000",
        "DISPLAY": ":99",
        "XVFB_WHD": "1280x720x16",
        "CHROME_EXECUTABLE_PATH": "/usr/bin/google-chrome"
    },
    user = "myuser",    
    launcher = ":scripts/start_xvfb_and_run_cmd.sh"
)