import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

export enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    PORT: number = 3000;

    @IsString()
    @IsUrl({ protocols: ['mongodb', 'mongodb+srv'], require_tld: false }, { message: 'MONGO_URI must be a valid MongoDB URL' })
    MONGO_URI: string;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    CASHFREE_APP_ID: string;

    @IsString()
    CASHFREE_SECRET_KEY: string;

    @IsString()
    FRONTEND_URL: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
