import { Context, Middleware } from '@microsoft/microsoft-graph-client';
import fetch from 'node-fetch';

export class HTTPMessageHandler implements Middleware {
  public async execute(context: Context): Promise<void> {
    context.response = await fetch(context.request, context.options);
  }
}
