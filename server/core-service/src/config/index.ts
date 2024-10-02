import developmentConfig from './development.json';
import productionConfig from './production.json';

interface Config {
  BACKEND_URL: {
    AUTH_SERVICE: string;
    CORE_SERVICE: string;
  };
  FRONTEND_URL: {
    APP_URL: string;
  };
}

let config: Config;

switch (process.env.APP_MODE as string) {
  case 'production':
    config = productionConfig;
    break;
  case 'development':
    config = developmentConfig;
    break;
  default:
    config = developmentConfig;
}

export default config;
