import * as _$better_call0 from "better-call";

//#region src/api/routes/error.d.ts
declare const error: _$better_call0.StrictEndpoint<"/error", {
  method: "GET";
  metadata: {
    openapi: {
      description: string;
      responses: {
        "200": {
          description: string;
          content: {
            "text/html": {
              schema: {
                type: "string";
                description: string;
              };
            };
          };
        };
      };
    };
    scope: "server";
  };
}, Response>;
//#endregion
export { error };