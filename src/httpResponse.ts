import objectPath from 'object-path';
import { FastifyReply } from 'fastify';
import { Flow, FlowInput } from '@flow-engine/core';

const httpResponse = <
    Input extends FlowInput & { reply: FastifyReply } = FlowInput & { reply: FastifyReply },
    Headers extends { [key: string]: any } = { [key: string]: any },
>(status: number, pathToBody: string, headers: Headers = ({} as Headers)): Flow<Input, Input> => {
    const httpResponseFlow = async (input: Input) => {
        await input.reply.status(status).headers(headers).send(objectPath.get(input, pathToBody));
        return input;
    };

    httpResponseFlow.id = 'httpResponse';
    return httpResponseFlow;
};

export default httpResponse;
