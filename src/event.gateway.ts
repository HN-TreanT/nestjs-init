import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "./modules/auth/auth.service";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly autheService: AuthService) {}
  afterInit(server: any) {}
  async handleConnection(socket: Socket) {
    console.log("connection socket id: ", socket.id);
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split("")[1]) {
      try {
        const email = await this.autheService.verifyToken((authHeader as string).split(" ")[1]);
        socket.data.email = email;

        socket.join(socket.data.email);
      } catch (e) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }
  handleDisconnect(socket: Socket) {
    console.log(socket.id, socket.data.email);
  }

  // ban socket theo point
  @SubscribeMessage("message")
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log("message", data);
    setTimeout(() => {
      // this.server.emit("message", data);
      this.server.to(socket.data.email + 1).emit("message", data);
    }, 1000);
  }
}
