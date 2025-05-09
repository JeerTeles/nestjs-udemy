import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
    
    async onModuleInit() {
        await this.$connect();
    }

    async onApplicationShutdown(signal?: string) {
        await this.$disconnect();
    }
}