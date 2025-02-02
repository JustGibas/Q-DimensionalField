/**
 * This file contains data-related logic for handling HTTP requests and responses.
 * 
 * Configuration options:
 * - ctx: The context object containing request and response.
 * - serviceFunction: The service function to call.
 * - params: The parameters to pass to the service function.
 */

import { BaseController } from "./baseController.ts";

/**
 * Handle the request and send the response
 * @param ctx - The context object containing request and response
 * @param serviceFunction - The service function to call
 * @param params - The parameters to pass to the service function
 */
export async function handleRequest(ctx: any, serviceFunction: Function, ...params: any[]) {
  try {
    const { value } = await ctx.request.body();
    const result = await serviceFunction(...params, value);
    BaseController.sendJsonResponse(ctx, 200, result);
  } catch (error) {
    BaseController.handleError(ctx, error);
  }
}
