import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Set global API prefix
   * All routes will be prefixed with /api/v1
   */
  app.setGlobalPrefix("api/v1");

  /**
   * Enable CORS
   * Allows frontend applications (e.g., Next.js) to access the API
   */
  app.enableCors({
    origin: ["http://localhost:3000"], // frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  });

  /**
   * Global validation pipe
   * - whitelist: strips unknown properties
   * - forbidNonWhitelisted: throws error on extra fields
   * - transform: auto transforms payloads (e.g., string → number)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/api/v1`);
}

bootstrap();
