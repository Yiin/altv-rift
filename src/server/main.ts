import rpc from "altv-rpc";

// rpc
rpc.init("server");

// setup
import "@shared/sentry";
import "./setup-globals";
import "./database";

// scenes
import "./scenes/auth";
