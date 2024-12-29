/**
 * This file contains the BaseController class, which provides common functionalities for handling HTTP requests and responses.
 * It can be extended by other controllers to avoid code duplication.
 * 
 * Configuration options:
 * - ctx: The context object containing request and response.
 * - next: The next middleware function to call.
 * - status: The HTTP status code to set in the response.
 * - body: The response body to send.
 */

import { Context } from "https://deno.land/x/oak/mod.ts";

// The BaseController class provides common functionalities for handling HTTP requests and responses
export class BaseController {
  /**
   * Send a JSON response
   * @param ctx - The context object containing request and response
   * @param status - The HTTP status code to set in the response
   * @param body - The response body to send
   */
  sendJsonResponse(ctx: Context, status: number, body: any) {
    ctx.response.status = status;
    ctx.response.body = body;
  }

  /**
   * Handle errors and send an error response
   * @param ctx - The context object containing request and response
   * @param error - The error object to handle
   */
  handleError(ctx: Context, error: Error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error", error: error.message };
  }
}
