import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	// await app.listen(8080);
	await app.listen(8080, async () => {
		console.log(
			`The server is running on ${8080} port: http://localhost:${8080}`,
		);
	});
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
