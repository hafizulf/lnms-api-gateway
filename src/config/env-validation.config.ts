import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'staging', 'production')
    .default('development'),
  APP_PORT: Joi.number().required(),
  USER_SERVICE_HTTP_URL: Joi.string().required(),
});

export const EnvValidationOptions = {
  allowUnknown: true,
  abortEarly: false,
};
