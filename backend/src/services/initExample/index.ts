/**
 * @summary
 * Centralized exports for InitExample service.
 *
 * @module services/initExample
 */

export * from './initExampleTypes';
export * from './initExampleService';
export {
  metadataSchema,
  createSchema,
  updateSchema,
  paramsSchema as initExampleParamsSchema,
  type MetadataInput,
  type CreateInput,
  type UpdateInput,
  type ParamsInput as InitExampleParamsInput,
} from './initExampleValidation';
