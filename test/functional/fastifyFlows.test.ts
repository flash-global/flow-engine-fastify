/* eslint-disable @typescript-eslint/indent */
// indent check disabled because of: https://github.com/typescript-eslint/typescript-eslint/issues/1824
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { httpEndpoint, fastifyLogger, LogType, httpResponse } from '../../src/index';
import { chain } from '@flow-engine/core';

const paramsRequestLogBuilder = (message: string) => async ({ request }: { request: FastifyRequest, reply: FastifyReply }) => ({
    message,
    content: request.params as object,
});

const bodyRequestLogBuilder = (message: string) => async ({ request }: { request: FastifyRequest, reply: FastifyReply }) => ({
    message,
    content: request.body as object,
});

describe('Test all endpoints with response and logs', () => {
    let logs: any[] = [];
    const instance = fastify({
        logger: {
            level: 'trace',
            stream: {
                write: (msg: string) => {
                    logs.push(JSON.parse(msg));
                },
            },
        },
    });

    httpEndpoint.get<{ Params: { value: string } }>(
        instance,
        '/api/test/:value',
        chain<{ request: FastifyRequest, reply: FastifyReply }>()
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                fastifyLogger(instance, LogType.info, paramsRequestLogBuilder('GET params')),
            )
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                httpResponse(200, 'request.params'),
            ),
    );

    httpEndpoint.post<{ Body: { value: number } }>(
        instance,
        '/api/test',
        chain<{ request: FastifyRequest, reply: FastifyReply }>()
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                fastifyLogger(instance, LogType.info, bodyRequestLogBuilder('POST body')),
            )
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                httpResponse(200, 'request.body'),
            ),
    );

    httpEndpoint.put<{ Body: { value: number } }>(
        instance,
        '/api/test',
        chain<{ request: FastifyRequest, reply: FastifyReply }>()
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                fastifyLogger(instance, LogType.info, bodyRequestLogBuilder('PUT body')),
            )
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                httpResponse(200, 'request.body'),
            ),
    );

    httpEndpoint.patch<{ Body: { value: number } }>(
        instance,
        '/api/test',
        chain<{ request: FastifyRequest, reply: FastifyReply }>()
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                fastifyLogger(instance, LogType.info, bodyRequestLogBuilder('PATCH body')),
            )
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                httpResponse(200, 'request.body'),
            ),
    );

    httpEndpoint.delete<{ Params: { value: string } }>(
        instance,
        '/api/test/:value',
        chain<{ request: FastifyRequest, reply: FastifyReply }>()
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                fastifyLogger(instance, LogType.info, paramsRequestLogBuilder('DELETE params')),
            )
            .add<{ request: FastifyRequest, reply: FastifyReply }>(
                httpResponse(200, 'request.params'),
            ),
    );

    test('GET endpoint fail - route not found', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/not-found', method: 'GET' });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('Route GET:/api/not-found not found');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(404);
    });

    test('GET endpoint success', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/test/5', method: 'GET' });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('GET params');
        expect(logs[1].value).toStrictEqual('5');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toStrictEqual(JSON.stringify({ value: '5' }));
    });

    test('POST endpoint fail - route not found', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/not-found', method: 'POST', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('Route POST:/api/not-found not found');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(404);
    });

    test('POST endpoint success', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/test', method: 'POST', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('POST body');
        expect(logs[1].value).toStrictEqual(5);
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toStrictEqual(JSON.stringify({ value: 5 }));
    });

    test('PUT endpoint fail - route not found', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/not-found', method: 'PUT', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('Route PUT:/api/not-found not found');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(404);
    });

    test('PUT endpoint success', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/test', method: 'PUT', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('PUT body');
        expect(logs[1].value).toStrictEqual(5);
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toStrictEqual(JSON.stringify({ value: 5 }));
    });

    test('PATCH endpoint fail - route not found', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/not-found', method: 'PATCH', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('Route PATCH:/api/not-found not found');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(404);
    });

    test('PATCH endpoint success', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/test', method: 'PATCH', payload: { value: 5 } });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('PATCH body');
        expect(logs[1].value).toStrictEqual(5);
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toStrictEqual(JSON.stringify({ value: 5 }));
    });

    test('DELETE endpoint fail - route not found', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/not-found', method: 'DELETE' });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('Route DELETE:/api/not-found not found');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(404);
    });

    test('DELETE endpoint success', async () => {
        logs = [];

        const response = await instance.inject({ url: '/api/test/5', method: 'DELETE' });

        expect(logs.length).toStrictEqual(3);

        expect(logs[0].msg).toStrictEqual('incoming request');
        expect(logs[0].reqId).toBeDefined();
        expect(logs[1].msg).toStrictEqual('DELETE params');
        expect(logs[1].value).toStrictEqual('5');
        expect(logs[1].reqId).toBeDefined();
        expect(logs[2].msg).toStrictEqual('request completed');
        expect(logs[2].reqId).toBeDefined();

        expect(response.statusCode).toStrictEqual(200);
        expect(response.body).toStrictEqual(JSON.stringify({ value: '5' }));
    });

    test('FastifyLogger without http request', async () => {
        logs = [];

        const flow = fastifyLogger<{ value: number, request?: FastifyRequest }>(instance, LogType.info, async ({ value }) => ({
            message: 'test log',
            content: { value },
        }));

        await flow({ value: 5 });

        expect(logs.length).toStrictEqual(1);
        expect(logs[0].msg).toStrictEqual('test log');
        expect(logs[0].value).toStrictEqual(5);
        expect(logs[0].reqId).not.toBeDefined();
    });
});