import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from '@fastify/cors';
import { poolRoutes } from "./routes/pools";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";




async function booststrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
      origin: true,
    })

    //em produção isso precisa ser uma variável ambiente
    await fastify.register(jwt, {
      secret:'nlwcopa',
    });

    await fastify.register(poolRoutes);
    await fastify.register(userRoutes);
    await fastify.register(gameRoutes);
    await fastify.register(guessRoutes);
    await fastify.register(authRoutes);
    
    
    
    
    

     await fastify.listen({port:3333,host:'0.0.0.0'})
}

booststrap();