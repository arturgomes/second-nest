import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this properly in production
  },
})
export class CsvImportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    // console.log('Client connected', client.id);
  }

  handleDisconnect(client: any) {
    // console.log('Client disconnected', client.id);
  }

  notifyProgress(importJobId: string, progress: any) {
    // In a real app, we would emit to a specific room for the user or job
    // this.server.to(`job-${importJobId}`).emit('import:progress', { ...progress, importJobId });
    this.server.emit('import:progress', { ...progress, importJobId });
  }
}
