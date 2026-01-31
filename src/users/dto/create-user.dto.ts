import { Role } from 'src/common/roles.enum';
export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    bio?: string;
    preferences?: Record<string, boolean>;
    roles?: Role[];
}