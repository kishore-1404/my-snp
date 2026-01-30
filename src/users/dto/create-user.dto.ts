export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    bio?: string;
    preferences?: Record<string, boolean>;
}