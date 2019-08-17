import { ApplicationConfiguration } from './app.config';

export function appConfigurationFactory(config: ApplicationConfiguration) {
    return () => config.load();
}
