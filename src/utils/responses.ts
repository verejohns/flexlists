import dotenv from "dotenv";
dotenv.config();

export enum Errors {
  NotAUser = 400,
  InvalidCredentials = 401,
  ListNotFound = 404,
  InvalidViewId = 405,
  UnknownType = 406,
  InvalidListId = 407,
  NotFound = 408,
  NotReachable = 409,
  UnacceptedTermsAndConditions = 410,
  InvalidPassword = 411,
  InvalidKey = 412,
  RedirectKey = 413,

  NotImplemented = 501,
  CreateError = 502,
  UserAlreadyMigrated = 503,
  InvalidInput = 504,
  UpdateError = 505,
  QueryError = 506,
  AlreadyHasAccess = 507,
  UserExists = 508,
  UserAlreadyActivated = 509,
  AlreadyMigrated = 510,
  ReservedUserName = 511,
  UserNotActivated = 512,
  NameAlreadyExists = 513,
  UserNameAlreadyExists = 514,
  UserEmailAlreadyExists = 515,
  UnknownMigrationError = 516,
  MigrationInProgress = 517,
  ReloadMigration = 518,
  SignInOrRegister = 519,

  DeprecatedFunction = 998,
  UnknownError = 999,
}

import * as Sentry from "@sentry/nextjs";

export const SentryMeta = {
  sentryInitialized: false,
};

export type LogLevel = "fatal" | "log" | "error" | "warning" | "info" | "debug";

const LogLevelErrorMappings: { [key: string]: string } = {
  NotAUser: "info",
  InvalidCredentials: "info",
  ListNotFound: "info",
  InvalidViewId: "info",
  UnknownType: "info",
  InvalidListId: "info",
  NotFound: "info",
  NotReachable: "fatal",
  UnacceptedTermsAndConditions: "info",
  InvalidPassword: "info",
  InvalidKey: "info",

  NotImplemented: "fatal",
  CreateError: "fatal",
  UserAlreadyMigrated: "info",
  InvalidInput: "info",
  UpdateError: "fatal",
  QueryError: "erorr",
  AlreadyHasAccess: "info",
  UserExists: "info",
  UserAlreadyActivated: "info",
  AlreadyMigrated: "info",
  ReservedUserName: "info",
  UserNotActivated: "info",
  NameAlreadyExists: "info",
  UserNameAlreadyExists: "info",
  UserEmailAlreadyExists: "info",
  UnknownMigrationError: "error",
  MigrationInProgress: "info",
  ReloadMigration: "info",
  SignInOrRegister: "info",

  DeprecatedFunction: "error",
  UnknownError: "fatal",
};

const StatusCodeErrroMappings: { [key: string]: number } = {
  NotAUser: 401,
  InvalidCredentials: 401,
  ListNotFound: 404,
  InvalidViewId: 404,
  UnknownType: 400,
  InvalidListId: 404,
  NotFound: 404,
  NotReachable: 503,
  UnacceptedTermsAndConditions: 400,
  InvalidPassword: 400,
  InvalidKey: 401,

  NotImplemented: 500,
  CreateError: 500,
  UserAlreadyMigrated: 503,
  InvalidInput: 504,
  UpdateError: 500,
  QueryError: 503,
  AlreadyHasAccess: 400,
  UserExists: 400,
  UserAlreadyActivated: 400,
  AlreadyMigrated: 400,
  ReservedUserName: 400,
  UserNotActivated: 400,
  NameAlreadyExists: 400,
  UserNameAlreadyExists: 400,
  UserEmailAlreadyExists: 400,
  UnknownMigrationError: 500,
  MigrationInProgress: 400,
  ReloadMigration: 400,
  SignInOrRegister: 400,

  DeprecatedFunction: 500,
  UnknownError: 500,
};

export function isErr(x: any): x is FlexlistsError {
  return typeof x === "object" && x != null && !(x as any).isSuccess;
}

export function isSucc(x: any): x is FlexlistsSuccess {
  return typeof x === "object" && x != null && (x as any).isSuccess;
}

const logLevelLevel = {
  fatal: 1000,
  error: 500,
  warning: 200,
  info: 10,
  debug: 5,
  log: 1,
};

export class FlexlistsError {
  //public [ERR] = true
  public isSuccess = false;
  public message: string;
  public code: number;
  public data: any;
  public trace: string = "";
  public httpStatus: number = 500;
  public logLevel: LogLevel = "log";

  constructor(
    message: string,
    code: number,
    data?: any,
    stackTrace?: string,
    logLevel?: LogLevel
  ) {
    this.message = message;
    this.code = code;
    this.data = data;
    const err = Errors[code ?? 999];
    this.logLevel =
      logLevel ?? (LogLevelErrorMappings[err] as LogLevel) ?? "error";
    this.httpStatus = StatusCodeErrroMappings[err];

    const _logLevel = (logLevel ?? this.logLevel) as LogLevel;

    const minimalLogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL ??
      "info") as LogLevel;

    if (logLevelLevel[_logLevel] < logLevelLevel[minimalLogLevel]) {
      return;
    }
    this.trace = "";
    if (stackTrace) {
      this.trace = stackTrace;
    }
    // just in case as most actual errors miss the trace for some )(*@#*)$%)*@(% reason
    let trace = this.getTrace()!.split("\n");
    trace.shift();
    trace.shift();
    this.trace += "\n\n" + trace.join("\n");

    if (SentryMeta.sentryInitialized) {
      Sentry.withScope((scope) => {
        scope.setExtra("trace", this.trace);
        scope.setExtra("data", data);
        scope.setExtra(
          "deploy-tag",
          process.env.NEXT_PUBLIC_DEPLOY_TAG ??
            process.env.DEPLOY_TAG ??
            "UKNOWN:BAD"
        );
        //Sentry.captureException(data.exception)
        console.log(
          `${(logLevel ?? this.logLevel).toString()}: ${message} - ${code}\n\n${
            this.trace
          }`
        );
        Sentry.captureMessage(
          `${message} - ${code}`,
          (logLevel ?? this.logLevel) as Sentry.SeverityLevel
        );
      });
      //Sentry.captureMessage(`${message} - ${code}`, (logLevel ?? this.logLevel) as Sentry.SeverityLevel)
      this.trace = "";
    } else {
      console.log(
        `${(logLevel ?? this.logLevel).toString()}: ${message} - ${code}\n\n${
          this.trace
        }`
      );
    }
  }

  private getTrace() {
    // get the stacktrace to this point
    return new Error().stack;
  }
}

export class FlexlistsSuccess<T = any> {
  //public [SUCC] = true
  public isSuccess = true;
  public message: string = "Success";
  public data: T | undefined;

  constructor(data?: T, message?: string) {
    //constructor({ message, data }: { message?: string, data?: T | undefined } = {}) {
    if (message) {
      this.message = message;
    }
    this.data = data;
  }
}
