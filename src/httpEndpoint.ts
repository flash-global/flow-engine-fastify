import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import {
    ContextConfigDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerBase,
    RawServerDefault,
} from 'fastify/types/utils';
import { FastifySchema } from 'fastify/types/schema';
import { Flow } from '@flow-engine/core';

type HandlerFlowInput<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    ContextConfig = ContextConfigDefault,
> = {
    request: FastifyRequest<RouteGeneric, RawServer, RawRequest, ContextConfig>,
    reply: FastifyReply<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig>,
};

const getEndpoint = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema,
>(instance: FastifyInstance, path: string, flow: Flow<HandlerFlowInput<RouteGeneric>>) => {
    instance.get<RouteGeneric, ContextConfig, SchemaCompiler>(path, {}, async (request, reply) => {
        await flow({ request, reply });
    });
};

const postEndpoint = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema,
>(instance: FastifyInstance, path: string, flow: Flow<HandlerFlowInput<RouteGeneric>>) => {
    instance.post<RouteGeneric, ContextConfig, SchemaCompiler>(path, {}, async (request, reply) => {
        await flow({ request, reply });
    });
};

const putEndpoint = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema,
>(instance: FastifyInstance, path: string, flow: Flow<HandlerFlowInput<RouteGeneric>>) => {
    instance.put<RouteGeneric, ContextConfig, SchemaCompiler>(path, {}, async (request, reply) => {
        await flow({ request, reply });
    });
};

const patchEndpoint = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema,
>(instance: FastifyInstance, path: string, flow: Flow<HandlerFlowInput<RouteGeneric>>) => {
    instance.patch<RouteGeneric, ContextConfig, SchemaCompiler>(path, {}, async (request, reply) => {
        await flow({ request, reply });
    });
};

const deleteEndpoint = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema,
>(instance: FastifyInstance, path: string, flow: Flow<HandlerFlowInput<RouteGeneric>>) => {
    instance.delete<RouteGeneric, ContextConfig, SchemaCompiler>(path, {}, async (request, reply) => {
        await flow({ request, reply });
    });
};

export { HandlerFlowInput };

export default {
    get: getEndpoint,
    post: postEndpoint,
    put: putEndpoint,
    patch: patchEndpoint,
    delete: deleteEndpoint,
};
