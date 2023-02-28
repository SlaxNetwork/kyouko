import { IsIn, IsNumber, IsString } from "class-validator";

const ServerTypes = ["lobby", "kotc"] as const;
type ServerType = typeof ServerTypes[number];

class CreateServerBody {
    @IsString()
    ip!: string;

    @IsNumber()
    port!: number;

    @IsString()
    @IsIn(ServerTypes)
    type!: ServerType;
}

export { CreateServerBody, ServerType };
