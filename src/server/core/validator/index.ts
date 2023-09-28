import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import * as validator from "@/core/validator";

type ValidationFunction<T = any> = (value: T) => Promise<string | undefined> | string | undefined;

type Validators = Record<string, ValidationFunction[]>;
type ValidationError = {
  type: "ValidationError";
  errors: Record<string, string>;
};

export function makeValidationError(fieldOrErrors: string, message: string): ValidationError;

export function makeValidationError(fieldOrErrors: Record<string, string>): ValidationError;

export function makeValidationError(
  fieldOrErrors: string | Record<string, string>,
  message?: string
) {
  return {
    type: "ValidationError",
    errors:
      typeof fieldOrErrors === "string"
        ? {
            [fieldOrErrors]: message,
          }
        : fieldOrErrors,
  };
}

export const validate = async (values: Record<string, any>, validators: Validators) => {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(validators)) {
    for (const rule of rules) {
      const error = await rule(values[field]);

      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw makeValidationError(errors);
  }
};

export const isRequired =
  (message: string): ValidationFunction =>
  (value: any) => {
    if (value === undefined || value === "") {
      return message;
    }

    return undefined;
  };

export const isEmail =
  (message: string): ValidationFunction =>
  (value: string) => {
    if (!validator.isEmail(value)) {
      return message;
    }

    return undefined;
  };

export const isUnique =
  <T extends keyof PrismaModels>(
    message: string,
    {
      model,
      field,
    }: {
      model: T;
      field: keyof PrismaModels[T];
    }
  ): ValidationFunction =>
  async (value: string) => {
    const delegate = container.get(PrismaClient)[model] as any;
    try {
      await delegate.findUniqueOrThrow({
        where: {
          [field]: value,
        },
      });
      return message;
    } catch {
      return undefined;
    }
  };

export const exists =
  <T extends keyof PrismaModels>(
    message: string,
    {
      model,
      field,
    }: {
      model: T;
      field: keyof PrismaModels[T];
    }
  ): ValidationFunction =>
  async (value?: string) => {
    const delegate = container.get(PrismaClient)[model] as any;

    try {
      await delegate.findFirstOrThrow({
        where: {
          [field]: value,
        },
      });
      return undefined;
    } catch {
      return message;
    }
  };
