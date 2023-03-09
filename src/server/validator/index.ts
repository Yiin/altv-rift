import * as validator from "validator";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";

type ValidationFunction<T = any> = (
  value: T
) => Promise<string | undefined> | string | undefined;

type Validators = Record<string, ValidationFunction[]>;

class ValidationError extends Error {
  constructor(public errors: Record<string, string>) {
    super("Validation error");
  }
}

export const makeValidationError = (field: string, message: string) =>
  new ValidationError({
    [field]: message,
  });

export const validate = async (
  values: Record<string, any>,
  validators: Validators
) => {
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
    throw new ValidationError(errors);
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
