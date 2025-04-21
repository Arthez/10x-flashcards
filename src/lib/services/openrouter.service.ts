import { logger } from '../../lib/logger';

// Types for model parameters and responses
interface ModelParameters {
  temperature: number;
  max_tokens: number;
  top_p?: number;
}

interface FlashcardResponse {
  question: string;
  answer: string;
}

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
  modelName: string;
  defaultParameters?: Partial<ModelParameters>;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterPayload {
  model: string;
  messages: ChatMessage[];
  response_format?: {
    type: string;
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, string>;
    };
  };
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

/**
 * Service for interacting with OpenRouter API to generate AI responses
 * for flashcard generation.
 */
export class OpenRouterService {
  // Public fields as specified in the plan
  public readonly apiKey: string;
  public readonly baseURL: string;
  public readonly modelName: string;
  public modelParameters: ModelParameters;

  // Private fields
  private readonly _defaultSystemMessage = "You are a helpful assistant for generating flashcards.";
  private readonly _responseFormat = {
    type: 'json_schema',
    json_schema: {
      name: 'flashcard-schema',
      strict: true,
      schema: {
        question: 'string',
        answer: 'string'
      }
    }
  };

  constructor(config: OpenRouterConfig) {
    // Initialize configuration
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.modelName = config.modelName;
    
    // Set default model parameters
    this.modelParameters = {
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      ...config.defaultParameters
    };
  }

  /**
   * Sends a chat completion request to generate a flashcard
   */
  public async sendChatCompletion(userMessage: string, context?: object): Promise<FlashcardResponse> {
    try {
      const payload = this._buildPayload(userMessage, context);
      
      logger.debug('Sending chat completion request', {
        context: 'OpenRouterService',
        data: {
          model: this.modelName,
          messageLength: userMessage.length,
          hasContext: Boolean(context)
        }
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const result = this._handleResponse(data);

      logger.info('Successfully generated flashcard', {
        context: 'OpenRouterService',
        data: {
          model: this.modelName,
          inputLength: userMessage.length,
          outputLength: result.question.length + result.answer.length
        }
      });

      return result;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error(String(error)));
      throw new Error('Failed to generate flashcard');
    }
  }

  /**
   * Updates model parameters
   */
  public setModelParameters(parameters: Partial<ModelParameters>): void {
    this.modelParameters = {
      ...this.modelParameters,
      ...parameters
    };
  }

  /**
   * Returns the current response format schema
   */
  public getResponseFormat(): typeof this._responseFormat {
    return { ...this._responseFormat };
  }

  /**
   * Builds the payload for the OpenRouter API request
   */
  private _buildPayload(userMessage: string, context?: object): OpenRouterPayload {
    // Enhance system message with context if provided
    let systemMessage = this._defaultSystemMessage;
    if (context) {
      systemMessage += `\nContext: ${JSON.stringify(context)}`;
    }

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    logger.debug('Building API payload', {
      context: 'OpenRouterService',
      data: {
        model: this.modelName,
        hasContext: Boolean(context),
        messageCount: messages.length
      }
    });

    return {
      model: this.modelName,
      messages,
      response_format: this._responseFormat,
      ...this.modelParameters
    };
  }

  /**
   * Handles and validates the API response
   */
  private _handleResponse(response: any): FlashcardResponse {
    try {
      // Validate response structure
      if (!response?.choices?.length) {
        throw new Error('Invalid response: missing choices array');
      }

      const choice = response.choices[0];
      if (!choice?.message?.content) {
        throw new Error('Invalid response: missing message content');
      }

      let parsedContent: unknown;
      try {
        parsedContent = JSON.parse(choice.message.content);
      } catch (e) {
        throw new Error('Invalid response: content is not valid JSON');
      }

      // Type guard for FlashcardResponse
      if (!this._isFlashcardResponse(parsedContent)) {
        throw new Error('Invalid response: missing required fields or invalid types');
      }

      return parsedContent;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error('Response validation failed'));
      throw new Error('Invalid response format from API');
    }
  }

  /**
   * Type guard for FlashcardResponse
   */
  private _isFlashcardResponse(data: unknown): data is FlashcardResponse {
    if (!data || typeof data !== 'object') return false;
    
    const candidate = data as Record<string, unknown>;
    return (
      typeof candidate.question === 'string' &&
      typeof candidate.answer === 'string' &&
      candidate.question.trim() !== '' &&
      candidate.answer.trim() !== ''
    );
  }

  /**
   * Log errors safely without exposing sensitive data
   */
  private _logError(error: Error): void {
    // Remove sensitive data from error details
    const sanitizedError = {
      name: error.name,
      message: error.message,
      // Only include stack in development
      stack: import.meta.env.DEV ? error.stack : undefined
    };

    logger.error('OpenRouter API error', sanitizedError, {
      context: 'OpenRouterService',
      data: {
        model: this.modelName,
        // Don't log the actual API key
        hasApiKey: Boolean(this.apiKey)
      }
    });
  }
} 
