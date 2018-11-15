import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import errorHandler from "errorhandler";
import { IndexRoute } from "./router/routes/index";
import { AuthRoute } from "./router/routes/auth";
import {ProjectsRoute } from "./router/routes/projects";
import { Router } from './router'
import { Storage } from './storage'

import cors from 'cors';

const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "http://localhost:8080",
    preflightContinue: false
};


/**
 * The server.
 *
 * @class Server
 */
export class Server {
  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    Router.init(this.app)

    // add storage
    Storage.init();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    //mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    // catch 404 and forward to error handler
    this.app.use(function(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();
    router.use(cors(options));

    IndexRoute.create(router);
    AuthRoute.create(router);
    ProjectsRoute.create(router);

    //use router middleware
    this.app.use(router);
  }

}
