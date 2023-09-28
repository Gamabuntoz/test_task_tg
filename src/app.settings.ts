import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';

export const initApp = (app: INestApplication): INestApplication => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Test_task')
    .setDescription('The task API description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = { errorsMessages: [] };
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          errorsForResponse.errorsMessages.push({
            message: e.constraints[constraintsKeys[0]],
            field: e.property,
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  SwaggerModule.setup('swagger', app, document);
  return app;
};
