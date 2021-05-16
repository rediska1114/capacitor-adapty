import { WebPlugin } from '@capacitor/core';
import { CapacitorAdaptyPlugin } from './definitions';

export class CapacitorAdaptyWeb extends WebPlugin implements CapacitorAdaptyPlugin {
  constructor() {
    super({
      name: 'CapacitorAdapty',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

const CapacitorAdapty = new CapacitorAdaptyWeb();

export { CapacitorAdapty };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(CapacitorAdapty);
