import { FlowInput, Flow } from '@flow-engine/core';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { FastifyLoggerInstance } from 'fastify/types/logger';

enum LogType {
    trace = 'trace',
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error',
    fatal = 'fatal',
}

type Log<Content, Message> = {
    content: Content,
    message: Message,
};

const fastifyLogger = <
    Input extends FlowInput & { request?: FastifyRequest } = Flow & { request?: FastifyRequest },
    LogContent extends object = object,
    LogMessage extends string = string,
    Instance extends FastifyInstance = FastifyInstance,
>(instance: Instance, logType: LogType, logBuilderFlow: Flow<Input, Log<LogContent, LogMessage>>): Flow<Input, Input> => {
    const flow: Flow<Input, Input> = async (input: Input): Promise<Input> => {
        const logger: FastifyLoggerInstance = input.request?.log || instance.log;
        const log = await logBuilderFlow(input) as Log<LogContent, LogMessage>;

        logger[logType](log.content, log.message);
        return input;
    };

    flow.id = 'fastifyLogger';
    return flow;
};

export { LogType, Log };
export default fastifyLogger;
