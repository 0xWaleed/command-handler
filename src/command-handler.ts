import {CommandInterface} from './command.interface';
import {CommandNameRequiredException, CommandNotExistException, MiddlewareIdentifierException, MiddlewareNotExistException} from './exceptions';
import {MiddlewareInterface} from './middleware.interface';
import {CommandEventData} from './command-event-data';


declare type CommandsMap = { [key: string]: CommandInterface };
declare type MiddlewaresMap = { [key: string]: MiddlewareInterface };


export class CommandHandler
{
    private _commands: CommandsMap = {};
    private _middlewares: MiddlewaresMap = {};

    public get commands()
    {
        return this._commands;
    }

    public get globalMiddlewares(): MiddlewaresMap
    {
        return this._middlewares;
    }

    public registerCommand(command: CommandInterface)
    {
        if (!command.identifier()) {
            throw new CommandNameRequiredException();
        }
        this._commands[command.identifier()] = command;
    }

    public unregisterCommand(identifier: string)
    {
        if (!this._commands[identifier]) {
            throw new CommandNotExistException(identifier);
        }
        delete this._commands[identifier];
    }

    public registerGlobalMiddleware(middleware: MiddlewareInterface)
    {
        if (!middleware.identifier()) {
            throw new MiddlewareIdentifierException();
        }
        this._middlewares[middleware.identifier()] = middleware;
    }

    public unregisterGlobalMiddleware(identifier: string)
    {
        if (!this._middlewares[identifier]) {
            throw new MiddlewareNotExistException(identifier);
        }
        delete this._middlewares[identifier];
    }

    public async handle(commandLine: string, commandEventData: CommandEventData)
    {
        for (const middleware in this._middlewares) {
            if (!this._middlewares.hasOwnProperty(middleware)) {
                continue;
            }
            this._middlewares[middleware].handle(commandEventData);
        }
        this._commands[commandLine].handle(commandEventData);
    }
}
