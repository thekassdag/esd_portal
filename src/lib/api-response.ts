import { NextResponse } from "next/server";

/**
 * Return a standardized success response.
 */
export function successResponse(data: any, message?: string, status = 200, meta?: any) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

/**
 * Return a standardized error response.
 */
export function errorResponse(error: string, status = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details ? { details } : {}),
    },
    { status }
  );
}
