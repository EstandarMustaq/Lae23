import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { APP_CONFIG, type AppConfig } from "./config.js";

const app = await NestFactory.create(AppModule);
app.setGlobalPrefix("api");

const swaggerConfig = new DocumentBuilder()
  .setTitle("Ponte Segura API")
  .setDescription("Community node API for flood response coordination.")
  .setVersion("0.1.0")
  .build();

SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig));

const config = app.get<AppConfig>(APP_CONFIG);
await app.listen(config.port);
