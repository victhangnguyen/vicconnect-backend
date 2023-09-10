/* eslint-disable @typescript-eslint/no-explicit-any */

import { JoiRequestValidationError } from "@global/helpers/error-handler";
import { Request } from "express";
import { ObjectSchema } from "joi";

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // console.log("__Debugger__joi-validation.decorators\n:::*** :::descriptor: ", descriptor, "\n");
      // console.log("__Debugger__joi-validation.decorators\n:::*** :::...args: ", ...args, "\n");

      const req: Request = args[0];
      // console.log("__Debugger__joi-validation.decorators\n:::*** :::req: ", req, "\n");
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
