import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';
import { 
  PriceUpdate, 
  PriceUpdates, 
  ValidatedPriceUpdateSchema, 
  ValidatedPriceUpdatesSchema,
  PRICE_EVENTS 
} from '../schemas/price.schema';

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer;

  private constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEvents();
    logger.info('Socket.IO server initialized');
  }

  public static getInstance(server: HTTPServer): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  private setupEvents(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Broadcast to all clients
  public broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Broadcast to specific room
  public broadcastToRoom(room: string, event: string, data: any): void {
    this.io.to(room).emit(event, data);
  }
} 