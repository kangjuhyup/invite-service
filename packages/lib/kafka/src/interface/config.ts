export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    options?: KafkaConfigOptions;
    schemaRegistry?: {
        url: string;
      };
  }
  
  export interface KafkaConfigOptions {
    connectionTimeout?: number;
    requestTimeout?: number;
    retry?: {
      retries: number;
    };
  }
  