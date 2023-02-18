import "reflect-metadata";
require("dotenv").config();
import { Container } from "typedi";

import express from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import prisma, { createPrismaDefaults } from "./database/prisma-client";

import controllers from "./controllers/index";
import middlewares from "./middlewares/index";
import interceptors from "./interceptors";
import { checkRequestAuthorization } from "./utils/authorization-checker";
import redis from "./database/redis-client";

useContainer(Container);

async function bootstrap() {
    if (process.env.PRIVATE_KEY == "KYOUKO" && process.env.DEV == "false") {
        console.error(
            `KYOUKO was used as the private key while not in a development enviornment, shutting down for security.`
        );
        throw "Cannot use development key KYOUKO in production.";
    }

    await prisma.$connect();
    await redis.connect();

    await createPrismaDefaults();

    const app = createExpressServer({
        controllers: [...controllers],
        middlewares: [...middlewares],
        interceptors: [...interceptors],

        authorizationChecker: checkRequestAuthorization,

        routePrefix: "/v1",

        defaultErrorHandler: false,
        classTransformer: true,
        validation: {
            enableDebugMessages: process.env.DEV == "true",
            forbidUnknownValues: true,
            whitelist: true,
            forbidNonWhitelisted: true
        },

        development: process.env.DEV == "true",

        defaults: {
            nullResultCode: 404,
            undefinedResultCode: 204,

            paramOptions: {
                required: true
            }
        }
    });

    app.use(express.json());

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
        console.log(`Started server on port ${PORT}.`);
    });
}

bootstrap().catch(async (err) => {
    console.error(err);

    // safely close processes.
    try {
        await prisma.$disconnect();
    } catch (_) {}
    try {
        await redis.disconnect();
    } catch (_) {}

    process.exit(1);
});
