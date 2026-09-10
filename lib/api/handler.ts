import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/api/errors";

type HandlerResult = { data: unknown; status?: number };
type Handler = (
  request: NextRequest,
  context: unknown,
) => Promise<HandlerResult>;

export const wrap =
  (handler: Handler) => async (request: NextRequest, context: unknown) => {
    console.log("Request received:", {
      method: request.method,
      url: request.url,
    });
    try {
      const { data, status = 200 } = await handler(request, context);
      return NextResponse.json({ data }, { status });
    } catch (error) {
      if (error instanceof ZodError)
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid input",
              details: error.flatten(),
            },
          },
          { status: 400 },
        );
      if (error instanceof AppError)
        return NextResponse.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status },
        );
      return NextResponse.json(
        { error: { code: "INTERNAL", message: "Internal server error" } },
        { status: 500 },
      );
    }
  };
