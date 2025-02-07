export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    options?: KafkaConfigOptions;
  }
  
  export interface KafkaConfigOptions {
    connectionTimeout?: number;
    requestTimeout?: number;
    retry?: {
      retries: number;
    };
  }
  