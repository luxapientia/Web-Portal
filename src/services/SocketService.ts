import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { getServerSession } from 'next-auth';
import { authOptions } from '../config';
import redis from '../lib/redis';

// Custom interface for socket with user data
interface CustomSocket extends Socket {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    myInvitationCode: string;
  };
}

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;
  private readonly USER_SOCKET_KEY = 'user:socket:';
  private readonly SOCKET_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private async saveUserSocket(userId: string, socketId: string) {
    await redis.setex(
      `${this.USER_SOCKET_KEY}${userId}`,
      this.SOCKET_EXPIRY,
      socketId
    );
  }

  private async removeUserSocket(userId: string) {
    await redis.del(`${this.USER_SOCKET_KEY}${userId}`);
  }

  private async getUserSocket(userId: string): Promise<string | null> {
    return redis.get(`${this.USER_SOCKET_KEY}${userId}`);
  }

  public initialize(server: HTTPServer) {
    if (this.io) {
      console.warn('Socket.IO server is already initialized');
      return;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // In production, replace with your actual domain
        methods: ['GET', 'POST']
      }
    });

    // Authentication middleware
    this.io.use(async (socket: CustomSocket, next) => {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          socket.user = session.user;
          next();
        } else {
          next(new Error('Unauthorized'));
        }
      } catch {
        next(new Error('Authentication failed'));
      }
    });

    this.setupEventHandlers();
    console.log('Socket.IO server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', async (socket: CustomSocket) => {
      console.log(`Client connected: ${socket.id}`);

      if (socket.user?.id) {
        // Store user's socket ID in Redis
        await this.saveUserSocket(socket.user.id, socket.id);

        // Handle market data subscription
        socket.on('subscribe:market', () => {
          socket.join('market-updates');
          console.log(`Client ${socket.id} subscribed to market updates`);
        });

        // Handle transaction updates subscription
        socket.on('subscribe:transactions', () => {
          socket.join(`transactions:${socket.user!.id}`);
          console.log(`Client ${socket.id} subscribed to transaction updates`);
        });

        // Handle live activity subscription
        socket.on('subscribe:activities', () => {
          socket.join('live-activities');
          console.log(`Client ${socket.id} subscribed to live activities`);
        });

        // Clean up on disconnect
        socket.on('disconnect', async () => {
          console.log(`Client disconnected: ${socket.id}`);
          await this.removeUserSocket(socket.user!.id);
        });
      }
    });
  }

  // Market data updates
  public emitMarketUpdate(data: object) {
    if (!this.io) return;
    this.io.to('market-updates').emit('market:update', data);
  }

  // Transaction updates for specific user
  public async emitTransactionUpdate(userId: string, data: object) {
    if (!this.io) return;
    
    try {
      const socketId = await this.getUserSocket(userId);
      if (socketId) {
        this.io.to(socketId).emit('transaction:update', data);
      }
    } catch (error) {
      console.error(`Failed to emit transaction update to user ${userId}:`, error);
    }
  }

  // Live activity updates
  public emitActivityUpdate(data: object) {
    if (!this.io) return;
    this.io.to('live-activities').emit('activity:update', data);
  }

  // User-specific notifications
  public async emitUserNotification(userId: string, data: object) {
    if (!this.io) return;
    
    try {
      const socketId = await this.getUserSocket(userId);
      if (socketId) {
        this.io.to(socketId).emit('notification', data);
      }
    } catch (error) {
      console.error(`Failed to emit notification to user ${userId}:`, error);
    }
  }

  // Global broadcast (use sparingly)
  public emitGlobalEvent(eventName: string, data: object) {
    if (!this.io) return;
    this.io.emit(eventName, data);
  }
} 