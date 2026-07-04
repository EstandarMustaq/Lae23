import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe<TInput> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<TInput>) {}

  transform(value: unknown): TInput {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: "Validation failed",
        issues: result.error.issues
      });
    }

    return result.data;
  }
}
